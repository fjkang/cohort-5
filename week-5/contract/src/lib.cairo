/// Interface for the Counter contract.
#[starknet::interface]
pub trait ICounter<TContractState> {
    /// Increment the counter by 1.
    fn increment(ref self: TContractState);
    /// Get the current count value.
    fn get_count(self: @TContractState, caller: starknet::ContractAddress) -> u128;
}

/// Simple counter contract that stores and increments a counter.
#[starknet::contract]
mod Counter {
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        counter: Map<ContractAddress, u128>,
    }

    #[abi(embed_v0)]
    impl CounterImpl of super::ICounter<ContractState> {
        fn increment(ref self: ContractState) {
            let caller = get_caller_address();
            let current = self.get_count(caller);
            self.counter.entry(caller).write(current + 1);
        }

        fn get_count(self: @ContractState, caller: ContractAddress) -> u128 {
            self.counter.entry(caller).read()
        }
    }
}
