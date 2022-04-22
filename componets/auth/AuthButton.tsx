import React from "react";
import { useAccount, useConnect } from "wagmi";
import { Button, NavLink, Spinner } from "reactstrap";
import toast from "react-hot-toast";
import Username from "./Username";
interface ConnetWalletButtonProps {}

const AuthButton: React.FunctionComponent<ConnetWalletButtonProps> = () => {
  const [{ data, error, loading }, connect] = useConnect();
  const [{ data: accountData }] = useAccount();

  React.useEffect(() => {
    if (error) {
      toast.error(`Oops, Sorry! Something went wrong: ${error.message}`);
    }
  }, [error]);

  if (accountData?.address) {
    return <Username address={accountData?.address} />;
  }

  const spineer = (
    <NavLink href="#" className="btn btn-outline-warning">
      <Spinner size="sm">Loading...</Spinner>{" "}
    </NavLink>
  );

  const button = (
    <Button
      outline
      color="warning"
      onClick={() => {
        connect(data.connectors[0]);
      }}
    >
      Connect Wallet
    </Button>
  );

  return loading ? spineer : button;
};

export default AuthButton;
