import { Box, Flex, Icon, Spacer, useColorMode, Text, keyframes } from "@chakra-ui/react"
import { ChakraProvider } from '@chakra-ui/react'
import { ToastContainer } from "react-toastify"
import { ExtensionContextProvider, useExtensionContext } from "./components/context/ExtensionContext"
import { Routes } from "./Routes"
import { SlideRoutes } from "./SlideRoutes"
import 'react-toastify/dist/ReactToastify.css';
import { MdKeyboardBackspace, MdSettings } from "react-icons/md"
import { If } from "./components/menu/If"
import { SlideWindow } from "./components/menu/SlideWindow"
import { useEffect, useMemo, useState } from "react"

const AnimationDuration = 150;

const fademove = keyframes`
    50% {
        transform: translateX(5px);
        opacity: 0;
    }
    100% {
        transform: translateX(0px);
        opacity: 1;
    }
`

function App() {

  return (
    <ChakraProvider>
      <Content />
    </ChakraProvider>
  )
}

function Content() {

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex alignItems="center" justifyContent="center" >
      {/* <Flex width="100%">
          <Box textAlign="left" lineHeight="18px">
            <Text fontSize="2xl"><strong>S</strong>metana </Text>
            <Text fontSize="sm" fontStyle="italic">explorer </Text>
          </Box>
          <Spacer />
          <Box justifySelf="end" alignSelf="end">
            <Button onClick={toggleColorMode}>
              <Icon as={MdSettings} />
            </Button>
          </Box>
        </Flex> */}
      <Box>
        <ToastContainer position="top-center" limit={1} theme="dark" hideProgressBar={true} closeButton={false} />
        <ExtensionContextProvider>
          <AppWindowInner routes={<Routes />} slideRoutes={<SlideRoutes />} />
        </ExtensionContextProvider>
      </Box>
    </Flex >)
}


function AppWindowInner(props: { routes: any, slideRoutes: any }) {

  const { slideActive, hasBack, routeBack, setSlideRoute, rpc, route: { footerContent: footer, title, path: routePath } } = useExtensionContext();

  return <Box
    width="360px"
    padding="10px"
    backgroundColor="#353535"
    position="relative"
    overflow="hidden"
  >
    <Flex direction="column" height="560px">
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
