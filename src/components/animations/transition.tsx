import { useEffect, useState } from "react"
import { motion, useAnimation } from 'framer-motion';

const Transition: React.FC = ({ children }) => {
  return <>{children}</>
  // const [displayChildren, setDisplayChildren] = useState<React.ReactNode>(children);
  // const [inTransition, setInTransition] = useState(false);
  // const controls = useAnimation();
  //
  // useEffect(() => {
  //   if (children !== displayChildren) {
  //     setInTransition(true);
  //   }
  // }, [children, setDisplayChildren, displayChildren]);
  //
  // useEffect(() => {
  //   if (!inTransition || displayChildren === children) {
  //     return;
  //   }
  //   controls.start({
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.3,
  //       ease: "easeOut"
  //     }    
  //   }).then(() => {
  //     setInTransition(false);
  //     setDisplayChildren(children);
  //   });
  // }, [inTransition, children, displayChildren])
  //
  // return (
  //   <>
  //     {inTransition && (
  //       <motion.div
  //         animate={controls}
  //         initial={{
  //           opacity: 0,
  //           background: '#fff',
  //           position: 'fixed',
  //           zIndex: 10,
  //           top: 0,
  //           left: 0,
  //           right: 0,
  //           bottom: 0,
  //         }}
  //       >
  //         {children}
  //       </motion.div>
  //     )}
  //     <div>{displayChildren}</div>
  //   </>
  // );
}

export { Transition };
