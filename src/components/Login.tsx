import React from 'react';
import { Button, Center, Image, Text, Box, useColorModeValue } from '@chakra-ui/react';

function Login() {
  const bg = useColorModeValue('lavender', 'purple.700');
  const color = useColorModeValue('purple', 'lavender');
  return (
    <>
      <Center m="20px">
        <form action="/auth/google" method="GET">
          <Button
            type="submit"
            rightIcon={(
              <Image
                padding="5px"
                width="40px"
                src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
              />
            )}
          >
            Sign in with Google
          </Button>
        </form>
      </Center>
      <Center>
        <Box backgroundColor={bg} width="max-content" m="15px" p="15px" borderRadius="md">
          <Center>
            <Text color={color} fontWeight="bold">
              Disclaimer
            </Text>
          </Center>
          <Text color={color}>
            This site is not an emergency service. As this site aims to help confront grief, there
            may be triggering content.
          </Text>
        </Box>
      </Center>
    </>
  );
}

export default Login;
