import { Button, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

function Home () {

    return (
        <View style={styles.container} >
            <Text >Hi</Text>
        <Button title='Go to Details' >
        </Button>
        </View>
    )

}

export default Home;