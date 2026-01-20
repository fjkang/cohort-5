#[starknet::interface]
pub trait ICounter<TContractState> {
    fn get(self: @TContractState) -> felt252;
    fn inc(ref self: TContractState);
    fn dec(ref self: TContractState);
}

// step 1, 创建合约
#[starknet::contract]
mod Counter {
    use event::EventEmitter;
    use starknet::event;
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use super::ICounter;

    #[storage]
    struct Storage {
        number: felt252,
    }
    // step 3，增加初始值
    #[constructor]
    fn constructor(ref self: ContractState, inital_value: felt252) {
        self.number.write(inital_value);
    }

    // step 4, 增加event
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ValueChanged: ValueChanged,
    }

    #[derive(Drop, starknet::Event)]
    struct ValueChanged {
        value: felt252,
    }

    #[abi(embed_v0)]
    impl CounterImpl of ICounter<ContractState> {
        fn get(self: @ContractState) -> felt252 {
            self.number.read()
        }
        fn inc(ref self: ContractState) {
            let value = self.get() + 1;
            self.number.write(value);

            let event = Event::ValueChanged(ValueChanged { value });
            self.emit(event)
        }
        fn dec(ref self: ContractState) {
            let value = self.get() - 1;
            self.number.write(value);

            let event = Event::ValueChanged(ValueChanged { value });
            self.emit(event)
        }
    }
}
