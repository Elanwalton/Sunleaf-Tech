import { Spinner, Flex, SpinnerProps } from '@chakra-ui/react';

export const FullPageSpinner = () => (
  <Flex
    justify="center"
    align="center"
    height="100vh"
    width="100vw"
    position="fixed"
    top={0}
    left={0}
    bg="rgba(255, 255, 255, 0.8)"
    zIndex="modal"
  >
    <Spinner
      {...({
        size: 'xl',
        color: 'blue.500',
        emptyColor: 'gray.200',
        speed: '0.65s',
      } as SpinnerProps)}
    />
  </Flex>
);
