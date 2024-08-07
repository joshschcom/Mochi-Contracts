# SampleName-Protocol Docs

This is the documentation for the SampleName-Protocol. It is a protocol for Lending & Borrowing.

## Important Contracts for implementation

### CErc20 / CETH

Each asset supported is integrated through a cToken contract, which is an EIP-20 compliant representation of balances supplied to the protocol. By minting cTokens, users (1) earn interest through the cToken’s exchange rate, which increases in value relative to the underlying asset, and (2) gain the ability to use cTokens as collateral.

cTokens are the primary means of interacting with the Compound Protocol; when a user mints, redeems, borrows, repays a borrow, liquidates a borrow, or transfers cTokens, she will do so using the cToken contract.

There are currently two types of cTokens: CErc20 and CEther. Though both types expose the EIP-20 interface, CErc20 wraps an underlying ERC-20 asset, while CEther simply wraps Ether itself. As such, the core functions which involve transferring an asset into the protocol have slightly different interfaces depending on the type, each of which is shown below.

-Write Functions-

#### Mint

The mint function transfers an asset into the protocol, which begins accumulating interest based on the current Supply Rate for the asset. The user receives a quantity of cTokens equal to the underlying tokens supplied, divided by the current Exchange Rate.

CErc20

`	function mint(uint mintAmount) returns (uint)`

msg.sender: The account which shall supply the asset, and own the minted cTokens.
mintAmount: The amount of the asset to be supplied, in units of the underlying asset.
RETURN: 0 on success, otherwise an Error code Before supplying an asset, users must first approve the cToken to access their token balance.

CEther

`	function mint() payable`

msg.value: The amount of ether to be supplied, in wei.
msg.sender: The account which shall supply the ether, and own the minted cTokens.
RETURN: No return, reverts on error.

#### Redeem

The redeem function converts a specified quantity of cTokens into the underlying asset, and returns them to the user. The amount of underlying tokens received is equal to the quantity of cTokens redeemed, multiplied by the current Exchange Rate. The amount redeemed must be less than the user’s Account Liquidity and the market’s available liquidity.

`	function redeem(uint redeemTokens) returns (uint)`

msg.sender: The account which shall redeem the cTokens, and own the redeemed tokens.
redeemTokens: The amount of cTokens to be redeemed, in units of the underlying asset.
RETURN: 0 on success, otherwise an Error code

#### Redeem Underlying

The redeem underlying function converts cTokens into a specified quantity of the underlying asset, and returns them to the user. The amount of cTokens redeemed is equal to the quantity of underlying tokens received, divided by the current Exchange Rate. The amount redeemed must be less than the user’s Account Liquidity and the market’s available liquidity.

`	function redeemUnderlying(uint redeemAmount) returns (uint)`

msg.sender: The account to which redeemed funds shall be transferred.
redeemAmount: The amount of underlying tokens to be redeemed.
RETURN: 0 on success, otherwise an Error code

#### Borrow

The borrow function transfers an asset from the protocol to the user, and creates a borrow balance which begins accumulating interest based on the Borrow Rate for the asset. The amount borrowed must be less than the user’s Account Liquidity and the market’s available liquidity. To borrow Ether, the borrower must be ‘payable’ (solidity).

CErc20 / CEther

`	function borrow(uint borrowAmount) returns (uint)`

msg.sender: The account to which borrowed funds shall be transferred.
borrowAmount : The amount of the underlying asset to be borrowed.
RETURN: 0 on success, otherwise an Error code

#### Repay Borrow

The repay function transfers an asset into the protocol, reducing the user’s borrow balance.

CErc20

`	function repayBorrow(uint repayAmount) returns (uint)`

msg.sender: The account which borrowed the asset, and shall repay the borrow.
repayAmount: The amount of the underlying borrowed asset to be repaid. A value of -1 (i.e. 2^256 - 1) can be used to repay the full amount.
RETURN: 0 on success, otherwise an Error code Before repaying an asset, users must first approve the cToken to access their token balance.

CEther

`	function repayBorrow() payable`

msg.value: The amount of ether to be repaid, in wei.
msg.sender: The account which borrowed the asset, and shall repay the borrow.
RETURN: No return, reverts on error.

#### Repay Borrow Behalf

The repay function transfers an asset into the protocol, reducing the target user’s borrow balance.

CErc20

`	function repayBorrowBehalf(address borrower, uint repayAmount) returns (uint)`

msg.sender: The account which shall repay the borrow.
borrower: The account which borrowed the asset to be repaid.
repayAmount: The amount of the underlying borrowed asset to be repaid. A value of -1 (i.e. 2^256 - 1) can be used to repay the full amount.
RETURN: 0 on success, otherwise an Error code Before repaying an asset, users must first approve the cToken to access their token balance.

CEther

`	function repayBorrowBehalf(address borrower) payable`

msg.value: The amount of ether to be repaid, in wei.
msg.sender: The account which shall repay the borrow.
borrower: The account which borrowed the asset to be repaid.
RETURN: No return, reverts on error.

#### Liquidate Borrow

A user who has negative account liquidity is subject to liquidation by other users of the protocol to return his/her account liquidity back to positive (i.e. above the collateral requirement). When a liquidation occurs, a liquidator may repay some or all of an outstanding borrow on behalf of a borrower and in return receive a discounted amount of collateral held by the borrower; this discount is defined as the liquidation incentive. A liquidator may close up to a certain fixed percentage (i.e. close factor) of any individual outstanding borrow of the underwater account. Unlike in v1, liquidators must interact with each cToken contract in which they wish to repay a borrow and seize another asset as collateral. When collateral is seized, the liquidator is transferred cTokens, which they may redeem the same as if they had supplied the asset themselves. Users must approve each cToken contract before calling liquidate (i.e. on the borrowed asset which they are repaying), as they are transferring funds into the contract.

CErc20

`	function liquidateBorrow(address borrower, uint amount, address collateral) returns (uint)`

msg.sender: The account which shall liquidate the borrower by repaying their debt and seizing their collateral.
borrower: The account with negative account liquidity that shall be liquidated.
repayAmount: The amount of the borrowed asset to be repaid and converted into collateral, specified in units of the underlying borrowed asset.
cTokenCollateral: The address of the cToken currently held as collateral by a borrower, that the liquidator shall seize.
RETURN: 0 on success, otherwise an Error code Before supplying an asset, users must first approve the cToken to access their token balance.

CEther

`	function liquidateBorrow(address borrower, address cTokenCollateral) payable`
msg.value: The amount of ether to be repaid and converted into collateral, in wei.
msg.sender: The account which shall liquidate the borrower by repaying their debt and seizing their collateral.
borrower: The account with negative account liquidity that shall be liquidated.
cTokenCollateral: The address of the cToken currently held as collateral by a borrower, that the liquidator shall seize.
RETURN: No return, reverts on error.

-Read Functions-

#### Exchange Rate

Each cToken is convertible into an ever increasing quantity of the underlying asset, as interest accrues in the market. The exchange rate between a cToken and the underlying asset is equal to

#### Get Cash

Cash is the amount of underlying balance owned by this cToken contract. One may query the total amount of cash currently available to this market.

#### Total Borrows

Total Borrows is the amount of underlying currently loaned out by the market, and the amount upon which interest is accumulated to suppliers of the market.

#### Borrow Balance

A user who borrows assets from the protocol is subject to accumulated interest based on the current borrow rate. Interest is accumulated every block and integrations may use this function to obtain the current value of a user’s borrow balance with interest.

#### Borrow Rate

At any point in time one may query the contract to get the current borrow rate per block.

#### Underlying Balance

The user’s underlying balance, representing their assets in the protocol, is equal to the user’s cToken balance multiplied by the Exchange Rate.

#### Supply Rate

At any point in time one may query the contract to get the current supply rate per block. The supply rate is derived from the borrow rate, reserve factor and the amount of total borrows.

#### Total Reserves

Reserves are an accounting entry in each cToken contract that represents a portion of historical interest set aside as cash which can be withdrawn or transferred through the protocol’s governance. A small portion of borrower interest accrues into the protocol, determined by the reserve factor.

#### Reserve Factor

The reserve factor defines the portion of borrower interest that is converted into reserves.

### Unitroller

The Unitroller is the Proxy Contract for the Comptroller. Users have to interact with the Unitroller to interact with the Comptroller.

### Comptroller

The Comptroller is the risk management layer; it determines how much collateral a user is required to maintain, and whether (and by how much) a user can be liquidated. Each time a user interacts with a cToken, the Comptroller is asked to approve or deny the transaction.

The Comptroller maps user balances to prices (via the Price Oracle) to risk weights (called Collateral Factors) to make its determinations. Users explicitly list which assets they would like included in their risk scoring, by calling Enter Markets and Exit Market.

-Write Functions-

#### Enter Markets

Enter into a list of markets - it is not an error to enter the same market more than once. In order to supply collateral or borrow in a market, it must be entered first.

`function enterMarkets(address[] calldata cTokens) returns (uint[] memory)`

msg.sender: The account which shall enter the given markets.
cTokens: The addresses of the cToken markets to enter.
RETURN: For each market, returns an error code indicating whether or not it was entered. Each is 0 on success, otherwise an Error code.

#### Exit Market

Exit a market - it is not an error to exit a market which is not currently entered. Exited markets will not count towards account liquidity calculations.

`function exitMarket(address cToken) returns (uint)`

msg.sender: The account which shall exit the given market.
cTokens: The addresses of the cToken market to exit.
RETURN: 0 on success, otherwise an Error code.

-Read Functions-

#### Get Assets In

Get the list of assets in the market.

`function getAssetsIn(address account) view returns (address[] memory)`

account: The account whose list of entered markets shall be queried.
RETURN: The address of each market which is currently entered into

#### Collateral Factor

A cToken’s collateral factor can range from 0-90%, and represents the proportionate increase in liquidity (borrow limit) that an account receives by minting the cToken. Generally, large or liquid assets have high collateral factors, while small or illiquid assets have low collateral factors. If an asset has a 0% collateral factor, it can’t be used as collateral (or seized in liquidation), though it can still be borrowed.

`function markets(address cTokenAddress) view returns (bool, uint, bool)`

cTokenAddress: The address of the cToken to check if listed and get the collateral factor for.
RETURN: Tuple of values (isListed, collateralFactorMantissa, isComped); isListed represents whether the comptroller recognizes this cToken; collateralFactorMantissa, scaled by 1e18, is multiplied by a supply balance to determine how much value can be borrowed. The isComped boolean indicates whether or not suppliers and borrowers are distributed COMP tokens.

#### Get Account Liquidity

Account Liquidity represents the USD value borrowable by a user, before it reaches liquidation. Users with a shortfall (negative liquidity) are subject to liquidation, and can’t withdraw or borrow assets until Account Liquidity is positive again.

For each market the user has entered into, their supplied balance is multiplied by the market’s collateral factor, and summed; borrow balances are then subtracted, to equal Account Liquidity. Borrowing an asset reduces Account Liquidity for each USD borrowed; withdrawing an asset reduces Account Liquidity by the asset’s collateral factor times each USD withdrawn.

Because the Protocol exclusively uses unsigned integers, Account Liquidity returns either a surplus or shortfall.

`function getAccountLiquidity(address account) view returns (uint, uint, uint)`

account: The account whose liquidity shall be calculated.
RETURN: Tuple of values (error, liquidity, shortfall). The error shall be 0 on success, otherwise an error code. A non-zero liquidity value indicates the account has available account liquidity. A non-zero shortfall value indicates the account is currently below his/her collateral requirement and is subject to liquidation. At most one of liquidity or shortfall shall be non-zero.

#### Close Factor

The percent, ranging from 0% to 100%, of a liquidatable account’s borrow that can be repaid in a single liquidate transaction. If a user has multiple borrowed assets, the closeFactor applies to any single borrowed asset, not the aggregated value of a user’s outstanding borrowing.

`function closeFactorMantissa() view returns (uint)`

RETURN: The closeFactor, scaled by 1e18, is multiplied by an outstanding borrow balance to determine how much could be closed.

#### Liquidation Incentive

The additional collateral given to liquidators as an incentive to perform liquidation of underwater accounts. A portion of this is given to the collateral cToken reserves as determined by the seize share. The seize share is assumed to be 0 if the cToken does not have a protocolSeizeShareMantissa constant. For example, if the liquidation incentive is 1.08, and the collateral’s seize share is 1.028, liquidators receive an extra 5.2% of the borrower’s collateral for every unit they close, and the remaining 2.8% is added to the cToken’s reserves.

`function liquidationIncentiveMantissa() view returns (uint)`

RETURN: The liquidationIncentive, scaled by 1e18, is multiplied by the closed borrow amount from the liquidator to determine how much collateral can be seized.

### Distribution Speeds

#### COMP Speed

The “COMP speed” unique to each market is an unsigned integer that specifies the amount of COMP that is distributed, per block, to suppliers and borrowers in each market. This number can be changed for individual markets by calling the \_setCompSpeed method through a successful Compound Governance proposal. The following is the formula for calculating the rate that COMP is distributed to each supported market.

#### COMP Distributed Per Block (All Markets)

The Comptroller contract’s compRate is an unsigned integer that indicates the rate at which the protocol distributes COMP to markets’ suppliers or borrowers, every Ethereum block. The value is the amount of COMP (in wei), per block, allocated for the markets. Note that not every market has COMP distributed to its participants (see Market Metadata). The compRate indicates how much COMP goes to the suppliers or borrowers, so doubling this number shows how much COMP goes to all suppliers and borrowers combined. The code examples implement reading the amount of COMP distributed, per Ethereum block, to all markets.

`uint public compRate;`

#### COMP Distributed Per Block (Single Market)

The Comptroller contract has a mapping called compSpeeds. It maps cToken addresses to an integer of each market’s COMP distribution per Ethereum block. The integer indicates the rate at which the protocol distributes COMP to markets’ suppliers or borrowers. The value is the amount of COMP (in wei), per block, allocated for the market. Note that not every market has COMP distributed to its participants (see Market Metadata). The speed indicates how much COMP goes to the suppliers or the borrowers, so doubling this number shows how much COMP goes to market suppliers and borrowers combined. The code examples implement reading the amount of COMP distributed, per Ethereum block, to a single market.

`mapping(address => uint) public compSpeeds;`

#### Claim COMP

Every Compound user accrues COMP for each block they are supplying to or borrowing from the protocol. Users may call the Comptroller’s claimComp method at any time to transfer COMP accrued to their address.

`// Claim all the COMP accrued by holder in all markets
function claimComp(address holder) public
// Claim all the COMP accrued by holder in specific markets
function claimComp(address holder, CToken[] memory cTokens) public
// Claim all the COMP accrued by specific holders in specific markets for their supplies and/or borrows
function claimComp(address[] memory holders, CToken[] memory cTokens, bool borrowers, bool suppliers) public`

#### Market Metadata

The Comptroller contract has an array called getAllMarkets that contains the addresses of each cToken contract. Each address in the getAllMarkets array can be used to fetch a metadata struct in the Comptroller’s markets constant. See the Comptroller Storage contract for the Market struct definition.

`CToken[] public getAllMarkets;`

### SimplePriceOracle

A simple Oracle which pushes the price to the Comptroller manually.

-Write Functions-

#### setUnderlyingPrice

Sets the price of the underlying asset with the price scaled by 1e18.

`function setUnderlyingPrice(CToken cToken, uint underlyingPriceMantissa)`

#### setDirectPrice

Sets the price of the asset.

`function setDirectPrice(address asset, uint price) public`

-Read Functions-

#### getUnderlyingPrice

Gets the price of the underlying asset.

`function getUnderlyingPrice(CToken cToken) public override view returns (uint)`

#### getUnderlyingAddress

Gets the address of the underlying asset.

`function _getUnderlyingAddress(CToken cToken) private view returns (address)`

## Developer Guide

Set Admin addresses

- Unitroller
- Comptroller
- Price Oracle

Configure Comptroller

-

## Addresses

The addresses of the contracts are in the [ADDRESSES.MD](ADDRESSES.MD) file.
