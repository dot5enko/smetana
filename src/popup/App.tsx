import { Box, Text } from "@chakra-ui/react"
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Box width="350px" height="500px" backgroundColor="blackAlpha.800" color="white">
        <Text fontSize="2xl" textAlign="center">Smetana </Text>
        <Text fontSize="sm" textAlign="center" color="whiteAlpha.400">explorer </Text>
      </Box>
    </ChakraProvider>
  );
}

export default App;
