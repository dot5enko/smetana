import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Input, Progress, Select, Spacer, useColorMode } from "@chakra-ui/react"
import { ChakraProvider, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icon'
import { MdSettings } from 'react-icons/md'
import { AppWindow, AppWindowConfig } from "./components/AppWindow"
import { Action, Selector, Submenu } from "./components/builder"
import { useState } from "react"

function App() {

  return (
    <ChakraProvider>
      <Content />
    </ChakraProvider>
  )
}

function Content() {

  const { colorMode, toggleColorMode } = useColorMode()

  const [config, setConfig] = useState<AppWindowConfig>({
    title: "main",
    entries: [
      Submenu("Addresses", "Watched addresses", Action("add new", () => {})),
      Submenu("Config", "Configuration",
        Submenu(
          "Network RPC",
          "Network provider",
          Selector("choose and rpc provider for requests to be done by this extension",
            false,
            [
              "https://rpc.ankr.com/solana",
            ],
            (rpcSelected: string[]) => {
              let newValue = rpcSelected[0];
              // alert(`rpc selected: ${newValue}`)
            },
            undefined,
            "https://rpc.ankr.com/solana",
            "https://api.mainnet-beta.solana.com",
            "https://api.devnet.solana.com",
            "https://api.testnet.solana.com",
          )
        )
      ),
      Action("About",() => {
        alert("created by dot5enko")
      })
    ]
  })

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
        <AppWindow config={config} />
      </Box>
    </Flex>)
}

export default App;
