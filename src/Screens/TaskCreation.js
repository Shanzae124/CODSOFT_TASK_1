import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';

const TaskCreation = () => {
  const [title, setTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState(null);

  const onAdd = async () => {
    try {
      const currentDate = new Date();
      const timestamp = currentDate.toLocaleString();
      const storedTasks = await AsyncStorage.getItem('task');
      const taskList = storedTasks ? JSON.parse(storedTasks) : [];
      if (!dueDate) {
        Alert.alert('Please select a due date to add a task.');
        return;
      }
      const newTask = {
        task: title,
        content: taskDescription,
        timestamp,
        dueDate: dueDate ? dueDate.toString() : null,
      };
      const updatedTasks = [...taskList, newTask];
      await AsyncStorage.setItem('task', JSON.stringify(updatedTasks));
      setTitle('');
      setTaskDescription('');
      setDueDate(null);
      Alert.alert('TASK CREATED');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <View style={styles.headingContainer}>
        <IonIcon name="create-sharp" size={70} color={'grey'} />
        <Text style={styles.heading1}>TA</Text>
        <Text style={styles.heading2}>SK</Text>
      </View>
      {/* Input fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Title"
          style={styles.inputTitle}
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <TextInput
          placeholder="Description"
          style={styles.inputDescription}
          value={taskDescription}
          onChangeText={text => setTaskDescription(text)}
          multiline={false}
          numberOfLines={4}
          returnKeyType="done"
        />
        {/* </View> */}
        {/* <View style={styles.dueDateButtonContainer}> */}
        <TouchableOpacity
          style={styles.duedateButton}
          onPress={() => setOpen(true)}>
          <Text style={styles.dueDateText}>
            Due Date: {dueDate ? dueDate.toString() : 'Select a due date'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            setDueDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onAdd}>
          <Text style={styles.buttonText}>ADD</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightyellow',
    justifyContent: 'space-around', // Center components vertically
  },
  buttonContainer: {
    height: '8%',
    width: '40%',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#d13c2c',
    marginVertical: 20,
  },
  inputContainer: {
    height: '60%',
    justifyContent: 'space-evenly',
  },
  inputTitle: {
    letterSpacing: 1.1,
    borderRadius: 15,
    marginVertical: 10,
    width: Dimensions.get('screen').width - 100,
    padding: 8,
    color: '#65000B',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    borderWidth: 1.5,
    borderColor: '#65000B',
  },
  inputDescription: {
    letterSpacing: 1.1,
    borderWidth: 1.5,
    borderColor: '#65000B',
    borderRadius: 15,
    marginVertical: 10, // Add vertical margin
    width: Dimensions.get('screen').width - 100,
    padding: 12,
    color: '#65000B',
    fontSize: 18, // Reduce font size for better readability
    fontFamily: 'Roboto-Regular',
  },
  headingContainer: {
    height: '20%',
    justifyContent: 'center',
    backgroundColor: 'lightyellow',
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5, // Add vertical margin
  },
  heading1: {
    fontSize: 36,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#d13c2c',
  },
  heading2: {
    fontSize: 36,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#133751',
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f7fbfc',
  },
  textContainer: {
    width: Dimensions.get('screen').width - 100,
    padding: 6,
    margin: 8,
  },
  dueDateText: {
    fontSize: 20, // Reduce font size for better readability
    color: '#65000B',
    fontWeight: '700',
    fontFamily: 'Roboto-Regular',
    padding: 10,
    margin: 5,
  },
  duedateButton: {
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#65000B',
    alignSelf: 'center',
    width: Dimensions.get('screen').width - 100,
  },
});

export default TaskCreation;
