import { Box, Button, Flex, Spacer, useColorMode } from "@chakra-ui/react"
import { ChakraProvider, Text } from '@chakra-ui/react'
import { AppWindow } from "./components/AppWindow"

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
      <AppWindow />
    </Flex >)
}

export default App;
