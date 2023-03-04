import { Box, Button, Flex, FormControl, FormHelperText, FormLabel, Input, Progress, Select, Spacer, useColorMode } from "@chakra-ui/react"
import { ChakraProvider, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icon'
import { MdSettings } from 'react-icons/md'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

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
        <Box>
          <Text variant="secondary"> Usage: </Text>
          <Progress colorScheme={"green"} size="lg" hasStripe value={64} />
        </Box>
        <FormControl>
          <FormLabel color='gray.400'>Solana rpc endpoint</FormLabel>
          <Select >
            <option value="https://rpc.ankr.com/solana">ankr</option>
            <option value="https://api.mainnet-beta.solana.com">mainnet-beta</option>
            <option value="https://api.devnet.solana.com">devnet</option>
            <option value="https://api.testnet.solana.com">testnet</option>
          </Select>
          <FormHelperText>Choose rpc endpoint we should use</FormHelperText>
        </FormControl>
        <Accordion allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Section 1 title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  Section 2 title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Flex>)
}

export default App;
