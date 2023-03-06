import { Box, Button, Flex, Spacer, useColorMode } from "@chakra-ui/react"
import { ChakraProvider, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icon'
import { MdSettings } from 'react-icons/md'
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

    <Flex
      // color="gray.300"
      alignItems="center" justifyContent="center">
      <Box width="350px" padding="15px"
        // border="1px solid" 
        borderRadius="lg"
      //  backgroundColor="#333"
      >
        <Flex width="100%">
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
        </Flex>
        {/* <Box>
          <Text variant="secondary"> Usage: </Text>
          <Progress colorScheme={"green"} size="lg" hasStripe value={64} />
        </Box> */}
        <AppWindow/>
      </Box>
    </Flex>)
}

export default App;
