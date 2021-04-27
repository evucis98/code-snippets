import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

//components
import PinkGradientBox from '@components/Global/PinkGradientBox';
import Buttons from '@components/Global/Buttons';
import Text from '@components/Global/Text';
import SearchInput from '@components/Chat/SearchInput';
import SearchCheckbox from '@components/Chat/Checkbox';
import ChatBox from '@components/Chat/ChatBox';
import EmergencyCall from '@components/Blocks/EmergencyCall';

//constants
import {COLORS, TEXTS} from '@constants/';

//api
import {fetchChatData} from '@services/Api.js';

//store
import {
  selectCheckBox,
  selectSearchValue,
  selectChatData,
} from '@store/selectors/chat';
import {addChatData} from '@store/actions/chat';
import {useSelector, useDispatch} from 'react-redux';

const Chat = () => {
  const [boxCount, setBoxCount] = useState(14);
  const [resultChatData, setResultChatData] = useState();

  const chatData = useSelector(selectChatData);

  const dispatch = useDispatch();

  const checkedActive = useSelector(selectCheckBox);
  const searchValue = useSelector(selectSearchValue);

  const fetchChat = async () => {
    const {data} = await fetchChatData();
    return data;
  };

  const filterBox = () => {
    const filteredBox =
      chatData &&
      chatData.filter((box) => {
        if (checkedActive) {
          return ~box.title.indexOf(searchValue) && box.chat_active;
        }

        return ~box.title.indexOf(searchValue);
      });

    setResultChatData(filteredBox);
  };

  useEffect(() => {
    filterBox();
  }, [checkedActive]);

  const setChatData = (data) => dispatch(addChatData(data));

  useEffect(() => {
    fetchChat().then((data) => {
      setResultChatData(data);
      setChatData(data);
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <PinkGradientBox
          title={{
            text: TEXTS.CHATSCREEN.TITLE,
          }}
          subtitle={{
            text: TEXTS.CHATSCREEN.SUBTITLE,
          }}
          locations={[0.3, 0.7]}
          propStyles={styles}
          angle={168}
          headerTitle="Chatta med oss">
          <View>
            <SearchInput filterBox={filterBox} />
            <SearchCheckbox />
          </View>
        </PinkGradientBox>

        {resultChatData && resultChatData.length ? (
          resultChatData.map((data, index) => (
            <ChatBox
              key={index}
              boxIndex={index}
              boxCount={boxCount}
              data={data}
            />
          ))
        ) : (
          <Text.Regular style={styles.notFound}>{TEXTS.NOT_FOUND}</Text.Regular>
        )}

        {resultChatData && boxCount < resultChatData.length && (
          <View style={{marginHorizontal: 30, marginTop: 30}}>
            <Buttons.PinkGradient
              title={TEXTS.BUTTONS.LOAD_MORE}
              onPress={() => setBoxCount(boxCount + 15)}
            />
          </View>
        )}

        <EmergencyCall
          stylesProp={{
            container: styles.emergencyCallContainer,
            text: styles.emergencyCallText,
          }}
          purpleStyle={true}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  emergencyCallContainer: {
    backgroundColor: COLORS.PRIMARY,
    marginTop: 85,
  },
  emergencyCallText: {
    color: COLORS.WHITE,
  },
  title: {
    marginBottom: 20,
  },
  notFound: {
    textAlign: 'center',
    marginVertical: 40,
  },
  groupImage: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 120,
  },
  checkbox: {
    height: 25,
    width: 25,
  },
});

export default Chat;
