import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Input, Select, useColorMode } from "@chakra-ui/react"
import { ChakraProvider, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icon'
import { MdNightlightRound } from 'react-icons/md'

function App() {

  return (
    <ChakraProvider>
      <Content />
    </ChakraProvider>
  )
}

function Content() {

  const { colorMode, toggleColorMode } = useColorMode()

  return (<Box width="350px" height="500px" padding="15px">
    <Flex>
      <Box>
        <Text fontSize="2xl" textAlign="center">Smetana </Text>
        <Text fontSize="sm" textAlign="center">explorer </Text>
      </Box>
      <Box alignSelf={"end"}>
        <Button onClick={toggleColorMode}>
          <Icon as={MdNightlightRound} />
        </Button>
      </Box>
    </Flex>
    <FormControl>
      <FormLabel>Solana rpc endpoint</FormLabel>
      <Select >
        <option value="https://rpc.ankr.com/solana">ankr</option>
        <option value="https://api.mainnet-beta.solana.com">mainnet-beta</option>
        <option value="https://api.devnet.solana.com">devnet</option>
        <option value="https://api.testnet.solana.com">testnet</option>
      </Select>
      <FormHelperText>Choose rpc endpoint we should use</FormHelperText>
    </FormControl>
  </Box>)
}

export default App;
