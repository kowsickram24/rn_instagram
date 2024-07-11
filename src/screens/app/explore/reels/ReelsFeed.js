import { Header } from "@rneui/themed";
import { Box, Text } from "../../../../theme";
import BackBtn from "../../../../components/buttons/backButton";
import { useNavigation } from "@react-navigation/native";

const ReelsFeed = () => {
    const navigation = useNavigation();
    return (
        <Box flex={1} backgroundColor={'mainwhite'}>
       <Header 
       barStyle="default"
       statusBarProps={{hidden: true}}
       leftContainerStyle={{flex: 3}}
       leftComponent={
       <Box flexDirection="row" alignItems="center" gap={"s"}>

       <BackBtn onPress={() => navigation.goBack()} />
       <Text> Reels</Text>
       </Box>
       }
       backgroundColor="white"
       />
        </Box>
    );
};
export default ReelsFeed