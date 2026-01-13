use starknet::SyscallResultTrait;
use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use counter_0xdb::hello_starknet::IHelloStarknetSafeDispatcher;
use counter_0xdb::hello_starknet::IHelloStarknetSafeDispatcherTrait;
use counter_0xdb::hello_starknet::IHelloStarknetDispatcher;
use counter_0xdb::hello_starknet::IHelloStarknetDispatcherTrait;

use counter_0xdb::counter::ICounterDispatcher;
use counter_0xdb::counter::ICounterDispatcherTrait;

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap_syscall().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap_syscall();
    contract_address
}

// step 3，增加初始值
fn deploy_counter(inital_value: u32) -> ContractAddress {
    let contract = declare("Counter").unwrap_syscall().contract_class();
    let constructor_calldata = array![inital_value.into()];
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap_syscall();
    contract_address
}
#[test]
fn test_counter() {
    // step 2, 增加测试
    let contract_address = deploy_counter(219);

    let dispatcher = ICounterDispatcher { contract_address };

    let number = dispatcher.get();

    assert(number == 219, 'Invalid number');

    dispatcher.inc();
    let number = dispatcher.get();
    assert(number == 220, 'Invalid number');
}

#[test]
fn test_increase_balance() {
    let contract_address = deploy_contract("HelloStarknet");

    let dispatcher = IHelloStarknetDispatcher { contract_address };

    let balance_before = dispatcher.get_balance();
    assert(balance_before == 0, 'Invalid balance');

    dispatcher.increase_balance(42);

    let balance_after = dispatcher.get_balance();
    assert(balance_after == 42, 'Invalid balance');
}

#[test]
#[feature("safe_dispatcher")]
fn test_cannot_increase_balance_with_zero_value() {
    let contract_address = deploy_contract("HelloStarknet");

    let safe_dispatcher = IHelloStarknetSafeDispatcher { contract_address };

    let balance_before = safe_dispatcher.get_balance().unwrap();
    assert(balance_before == 0, 'Invalid balance');

    match safe_dispatcher.increase_balance(0) {
        Result::Ok(_) => core::panic_with_felt252('Should have panicked'),
        Result::Err(panic_data) => {
            assert(*panic_data.at(0) == 'Amount cannot be 0', *panic_data.at(0));
        }
    };
}
