import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Input, Progress, Select, Spacer, useColorMode } from "@chakra-ui/react"
import { ChakraProvider, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icon'
import { MdSettings } from 'react-icons/md'
import { AppMenuEntry, AppWindow, AppWindowConfig, MenuEntryType } from "./components/AppWindow"
import { Action, MenuEntry, Submenu } from "./components/MenuEntry"

function App() {

  return (
    <ChakraProvider>
      <Content />
    </ChakraProvider>
  )
}

function Content() {

  const { colorMode, toggleColorMode } = useColorMode()

  const config: AppWindowConfig = {
    entries: [
      Action("Addresses", () => {
        alert('addresses not implemented')
      }),
      Submenu("Config", "Configuration", Action("test", () => {
        alert("this is test action")
      }), Action("another test", () => {
        alert("this is test action")
      })),
    ],
    title: "main"
  }

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
        <Box>
          <Text variant="secondary"> Usage: </Text>
          <Progress colorScheme={"green"} size="lg" hasStripe value={64} />
        </Box>
        {/* <FormControl>
          <FormLabel color='gray.400'>Solana rpc endpoint</FormLabel>
          <Select >
            <option value="https://rpc.ankr.com/solana">ankr</option>
            <option value="https://api.mainnet-beta.solana.com">mainnet-beta</option>
            <option value="https://api.devnet.solana.com">devnet</option>
            <option value="https://api.testnet.solana.com">testnet</option>
          </Select>
          <FormHelperText>Choose rpc endpoint we should use</FormHelperText>
        </FormControl> */}
        <AppWindow config={config} />
      </Box>
    </Flex>)
}

export default App;
