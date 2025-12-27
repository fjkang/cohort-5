#[starknet::interface]
pub trait ICounter<TContractState> {
    fn get(self: @TContractState) -> u32;
    fn inc(ref self: TContractState);
}

#[starknet::contract]
mod Counter {
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use super::ICounter;

    #[storage]
    struct Storage {
        number: u32,
    }

    #[constructor]
    fn constructor(ref self: ContractState, initial_value: u32) {
        self.number.write(initial_value);
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ValueChanged: ValueChanged,
    }

    #[derive(Drop, starknet::Event)]
    struct ValueChanged {
        value: u32,
    }

    #[abi(embed_v0)]
    impl CounterImpl of ICounter<ContractState> {
        fn get(self: @ContractState) -> u32 {
            self.number.read()
        }
        fn inc(ref self: ContractState) {
            let value = self.get() + 1;
            self.number.write(value);
            let event = Event::ValueChanged(ValueChanged { value });
            self.emit(event);
        }
    }
}
