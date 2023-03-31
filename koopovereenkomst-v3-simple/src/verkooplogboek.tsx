import React, { createContext, useReducer } from "react";

/**
 * Verkooplogboek (VLB)
 *
 * This is a example of a context provider that uses a reducer to update the state.
 * The reducer is called from the child components.
 * The child components are not aware of the reducer.
 * The reducer is only aware of the actions.
 *
 * Example usage:
 * ```
 * import { useContext } from "react";
 *
 * const { state, dispatch } = useContext(VLBContext);
 *
 * dispatch({ type: 'addTriple', payload: {
 *  subject: 'koopovereenkomst:',
 *  predicate: 'a',
 *  object: 'zvg:Koop',
 * } });
 * ```
 */
interface VLB {
  name: string;
  age: number;
  graph: string[];
}

type VLBAction =
  | { type: "updateName"; payload: string }
  | { type: "updateAge"; payload: number }
  | {
      type: "addTriple";
      payload: { subject: string; predicate: string; object: string };
    };

interface VLBContextProps {
  state: VLB;
  dispatch: React.Dispatch<VLBAction>;
};

const initialState: VLB = {
  name: '',
  age: 0,
  graph: [],
};

const VLBContext = createContext<VLBContextProps>({
  state: initialState,
  dispatch: () => null,
});

function reducer(state: VLB, action: VLBAction): VLB {
  // FIXME: reducer is run twice on every action. I'm not sure why.
  switch (action.type) {
    case "updateName":
      return { ...state, name: action.payload };
    case "updateAge":
      return { ...state, age: action.payload };
    case "addTriple":
      const triple = `${action.payload.subject} ${action.payload.predicate} ${action.payload.object} .`;
      const newGraph = state.graph;

      if (newGraph.indexOf(triple) === -1) {
        newGraph.push(triple);
      }

      return { ...state, graph: newGraph };
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

interface Props {
  children: React.ReactNode;
}

const VLBProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <VLBContext.Provider value={{ state, dispatch }}>
      {children}
    </VLBContext.Provider>
  );
};

export { VLBContext, VLBProvider };
