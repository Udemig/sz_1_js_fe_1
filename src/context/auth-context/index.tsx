import { ReactNode, createContext } from "react";
import { useSelector } from "react-redux";
import { AuthStateType, getUserInfoAction } from "../../redux/slice/authSlice";
import { RootState, appDispatch } from "../../redux/store";

export type AuthContextComponentPropsType = {
  children: ReactNode;
};

export type AuthContextType = {};

const AuthContextProvider = createContext<AuthContextType>({});

export default function AuthContext(props: AuthContextComponentPropsType) {
  const authState = useSelector<RootState, AuthStateType>(
    (state) => state.authState
  );

  if (authState.token && !authState.user) {
    appDispatch(getUserInfoAction());
  }

  const contextValue: AuthContextType = {};
  return (
    <AuthContextProvider.Provider value={contextValue}>
      {props.children}
    </AuthContextProvider.Provider>
  );
}
