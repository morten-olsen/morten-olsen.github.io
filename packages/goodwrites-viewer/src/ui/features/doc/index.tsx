import React, {
  createContext,
  useContext,
  FC,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { DocumentResult } from '@morten-olsen/goodwrites';

type Document = DocumentResult;

declare var __DOC_LOCATION__: string;

type DocContextValue = {
  doc: Document;
};

type DocProviderProps = {
  children: ReactNode;
};

const DocContext = createContext<DocContextValue>(null as any);

const DocProvider: FC<DocProviderProps> = ({ children }) => {
  const [doc, setDoc] = useState<Document>(
    require(__DOC_LOCATION__) as Document
  );

  useEffect(() => {
    const hot = (module as any).hot;

    if (hot) {
      hot.accept('../../../../demo-article/index.yml', () => {
        const newDoc = require(__DOC_LOCATION__) as Document;
        setDoc(newDoc);
      });
    }
  }, []);

  return <DocContext.Provider value={{ doc }}>{children}</DocContext.Provider>;
};

const useDoc = () => {
  const { doc } = useContext(DocContext);
  return doc;
};

export { DocProvider, DocContext, useDoc };
