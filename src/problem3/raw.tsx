interface WalletBalance {
  currency: string;
  amount: number;
}

// Code duplication
// --> extends from `WalletBalance`
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Should avoid using `any` if the type of variable is known
  // Replace `switch case` with a more maintainable and readable alternative
  // --> Replace with constant mapping
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // The `blockchain` property does not exist in the `WalletBalance` interface
        // --> Add property `blockchain` to the `WalletBalance` interface
        const balancePriority = getPriority(balance.blockchain);

        // Variable `lhsPriority` is not defined
        // Avoid using "magic number" `-99`
        // --> Replace `lhsPriority` with `balancePriority` variable
        // --> Combine conditional expressions to improve code readability and maintainability
        // --> Declare constant: -99
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        // Miss return value when `leftPriority` = `rightPriority`
        // --> Use `rightPriority - leftPriority` as return value to make code simply
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });

    // The `prices` dependency is redundant
    // Miss `getPriority` dependency
    // --> Remove `prices` and add `getPriority` to dependencies array
  }, [balances, prices]);

  // --> Combine format logic with sort logic to reduce redundant calculator
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // `sortedBalances` is not been formatted, so can not use
  // --> Use `formattedBalances` variable
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // Should handle for case `prices[balance.currency]` is undefined
      // --> Replace value with 0 when `prices[balance.currency]` is undefined
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
