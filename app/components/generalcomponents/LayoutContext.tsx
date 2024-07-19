import { createContext, useContext } from "react";

const LayoutContext = createContext({ openModal: () => {} });

export const useLayoutContext = () => useContext(LayoutContext);

export default LayoutContext;
