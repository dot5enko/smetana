import { Box, Flex, Icon, Spacer, Text, useColorMode } from "@chakra-ui/react"
import { ChakraProvider } from '@chakra-ui/react'
import { ToastContainer } from "react-toastify"
import { ExtensionContextProvider, useExtensionContext } from "./components/context/ExtensionContext"
import { Routes } from "./Routes"
import { SlideRoutes } from "./SlideRoutes"
import 'react-toastify/dist/ReactToastify.css';
import { MdKeyboardBackspace, MdSettings } from "react-icons/md"
import { If, SlideWindow } from "./components/menu"
import { useEffect, useState } from "react"

function App() {

  return (
    <ChakraProvider>
      <Content />
    </ChakraProvider>
  )
}

function Content() {

  const { colorMode, toggleColorMode } = useColorMode()

  // broken initial color mode fix
  useEffect(() => {
    if (colorMode == 'light') {
      toggleColorMode();
    }
  }, [])


  return (
    <Flex alignItems="center" justifyContent="center" >
      <Box>
        <ToastContainer position="top-center" limit={1} theme="dark" hideProgressBar={true} closeButton={false} />
        <ExtensionContextProvider>
          <Flex>
            <AppWindowInner routes={<Routes />} slideRoutes={<SlideRoutes />} />
          </Flex>
        </ExtensionContextProvider>
      </Box>
    </Flex >)
}


const useHash = () => {
  const [path, setPath] = useState(window.location.hash);
  const listenToPopstate = () => {
    const winPath = window.location.hash;
    setPath(winPath);
  };
  useEffect(() => {
    window.addEventListener("popstate", listenToPopstate);
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
    };
  }, []);
  return path;
};

function AppWindowInner(props: { routes: any, slideRoutes: any }) {

  const { setRoute, cleanupHistory, route, setWidth } = useExtensionContext();

  const hash = useHash();

  useEffect(() => {

    let specificWidth = false

    if (route.path == "addr_view" || route.path == "") {
      setWidth(700);
      specificWidth = true;
    } 

    if (route.path == "edit_datatype" || route.path == "edit_typefield") {
      setWidth(450);
      specificWidth = true;
    }
    
    if (route.path == "addresses") {
      setWidth(500);
      specificWidth = true;
    }

    
    if (!specificWidth) {
      setWidth(350);
    }
  }, [route])

  useEffect(() => {
    if (hash != "") {
      const prevVal = hash;

      let [routePath, argsRaw] = prevVal.substring(1).split("=")

      let args = [];

      if (argsRaw) {
        args = JSON.parse(decodeURIComponent(argsRaw))
      }

      cleanupHistory();
      setRoute(routePath, "", false, ...args)

      window.location.hash = ""
    }
  }, [hash])

  const { slideActive, hasBack, routeBack, setSlideRoute, rpc, route: { footerContent: footer, title, path: routePath }, contentWidth } = useExtensionContext();

  return <Box
    width={contentWidth + "px"}
    padding="10px"
    transition=".25s all ease"
    backgroundColor="#283845"
    position="relative"
    overflow="hidden"
  >
    <Flex direction="column" height="98.5vh" boxSizing="border-box">
      <Box padding="5px 0px" height="55px">
        <Flex>
          {hasBack ? <Box
            cursor="pointer"
            border="1px solid gray"
            padding="10px 15px"
            borderRadius="6px"
            onClick={() => {
              routeBack();
            }}
          ><Icon as={MdKeyboardBackspace} /></Box> : null}
          <Flex alignItems="center" paddingLeft="20px">
            <Text>{title}</Text>
          </Flex>
          <Spacer />
          <Box
            cursor="pointer"
            border="1px solid gray"
            padding="10px 15px"
            borderRadius="6px"
            onClick={() => {
              setSlideRoute("config")
            }}
          ><Icon as={MdSettings} /></Box>
        </Flex>
      </Box>
      <Box
        marginTop="5px"
        overflowY="scroll"
        css={{
          '&::-webkit-scrollbar': {
            display: "none",
          }
        }}
      >
        {props.routes}
      </Box>
      <Spacer />
      <If condition={footer}>
        <Flex marginTop="10px" width="100%" minHeight="65px" padding="5px 0" />
      </If>
      <SlideWindow windowActive={slideActive} >
        {props.slideRoutes}
      </SlideWindow>
    </Flex>
  </Box >
}

export default App;
