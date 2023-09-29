import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Timestamp from 'react-timestamp';

const Dashboard = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState('');

  // loading the tasks from local storage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('task');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);
  // Completion logics
  const getCompletionStatus = percentage => {
    if (percentage >= 100) {
      return {taskStatus: 'Completed', color: 'green'};
    } else if (percentage > 0) {
      return {taskStatus: 'In Progress', color: 'orange'};
    } else {
      return {taskStatus: 'Not Started', color: 'red'};
    }
  };

  // editing logics
  const openEditModal = task => {
    setSelectedTask(task);
    setEditedTitle(task.task);
    setEditedContent(task.content);
    setCompletionPercentage(task.completionPercentage);
    setEditModalVisible(true);
  };

  const saveEditedTask = async () => {
    if (!selectedTask) return;

    // updating tasks in local storage
    const updatedTasks = tasks.map(task => {
      if (task === selectedTask) {
        return {
          ...task,
          task: editedTitle,
          content: editedContent,
          completionPercentage: parseInt(completionPercentage),
        };
      }
      return task;
    });
    try {
      await AsyncStorage.setItem('task', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setEditModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  // deletion logic
  const deleteTask = async itemToDelete => {
    try {
      // filtering out the item user want to delete and updating the array
      const updatedTasks = tasks.filter(item => item !== itemToDelete);
      // updating the list task after the user selected task has been deleted
      await AsyncStorage.setItem('task', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.log(error);
    }
  };

  // rendering the tasks with task(title,description,completionStaus,   createdDate,dueDate)
  const renderTaskItem = ({item}) => {
    const {taskStatus, color} = getCompletionStatus(item.completionPercentage);
    return (
      <View style={[styles.itemContainer, {}]}>
        <View style={styles.textContainer}>
          <Text style={[styles.titleText, styles.titleOutline]}>
            {item.task}
          </Text>
          <Text style={styles.descriptionText}>{item.content}</Text>
          <Text style={styles.dateText}>CREATED: {item.timestamp}</Text>
          <Text style={styles.dueDateText}>
            Due Date:{' '}
            {item.dueDate ? new Date(item.dueDate).toLocaleString() : 'Not set'}
          </Text>
          <Text style={[styles.completionText, {color: color}]}>
            Completion: {item.completionPercentage}%
          </Text>
          <Text style={[styles.completionText, {color: color}]}>
            Status: {taskStatus}
          </Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          {/* deletion icon */}
          <IonIcon
            name="trash"
            size={35}
            style={{
              color: '#d13c2c',
              marginTop: 30,
            }}
            onPress={() => deleteTask(item)}
          />
          {/* editing icon */}
          <IonIcon
            name="create"
            size={35}
            style={{
              color: '#d13c2c',
            }}
            onPress={() => openEditModal(item)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headingTextContainer}>
        <IonIcon
          name="person-circle-outline"
          size={50}
          onPress={loadTasks}
          color={'grey'}
          style={{padding: 4}}
        />
        <Text style={styles.headingText}>DASH</Text>
        <Text style={styles.boardText}>BOARD</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{borderEndWidth: 2}}
          onPress={() => navigation.navigate('TaskCreation')}>
          <Text style={styles.text}>NEW TASK</Text>
        </TouchableOpacity>
        <IonIcon
          name="refresh-circle"
          size={50}
          color={'white'}
          style={{alignSelf: 'flex-end'}}
          onPress={loadTasks}
        />
      </View>
      {tasks.length === 0 ? (
        <Text style={styles.subHeaderText}></Text>
      ) : (
        <>
          <Text style={styles.subHeaderText}>TASKS LIST</Text>
          <FlatList
            data={tasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderTaskItem}
          />
          {/* Modal for editing tasks */}
          <Modal visible={editModalVisible} animationType="fade">
            <View style={styles.modalContainer}>
              <TextInput
                style={styles.editInput}
                placeholder="Edit Title"
                value={editedTitle}
                onChangeText={text => setEditedTitle(text)}
              />
              <TextInput
                style={styles.editInput}
                placeholder="Edit Content"
                value={editedContent}
                onChangeText={text => setEditedContent(text)}
              />
              <TextInput
                style={styles.editInput}
                placeholder="Completion Percentage"
                value={completionPercentage}
                onChangeText={text => setCompletionPercentage(text)}
              />
              <TouchableOpacity
                style={styles.editButton}
                onPress={saveEditedTask}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    margin: 6,
    borderWidth: 2,
    borderTopStartRadius: 20,
    borderBottomEndRadius: 20,
    borderColor: '#d13c2c',
  },
  textContainer: {
    width: Dimensions.get('screen').width - 100,
    padding: 6,
    margin: 8,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 10,
    width: '90%',
    padding: 12,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#d13c2c',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 26,
    fontWeight: '600',
    color: '#f7fbfc',
    marginEnd: 10,
    letterSpacing: 1.1,
  },
  descriptionText: {
    fontSize: 22,
    color: '#65000B',
    marginBottom: 20,
    fontFamily: 'Roboto-Medium',
    margin: 5,
    letterSpacing: 1.1,
  },
  headingText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#d13c2c',
    letterSpacing: 1,
  },
  boardText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#133751',
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#65000B',
    fontFamily: 'Roboto-Bold',
    letterSpacing: 1.2,
  },
  titleOutline: {
    borderBottomWidth: 2,
    borderColor: '#d13c2c',
    margin: 4,
    padding: 4,
  },
  editButton: {
    margin: 10,
    width: '40%',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#d13c2c',
  },
  editButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f7fbfc',
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFE0',
  },
  editInput: {
    borderWidth: 1.5,
    borderColor: '#65000B',
    width: '80%',
    borderRadius: 22,
    margin: 12,
    padding: 12,
    color: '#65000B',
    letterSpacing: 1,
  },
  headingTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  dateText: {
    color: '#65000B',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    // fontWeight: '700',
    margin: 5,
    marginHorizontal: 2,
    padding: 6,
    letterSpacing: 1,
  },
  dueDateText: {
    fontSize: 20,
    color: '#65000B',
    fontWeight: '700',
    fontFamily: 'Roboto-Regular',
    margin: 5,
    letterSpacing: 1,
  },
  completionText: {
    fontSize: 18,
    // fontWeight: '700',
    margin: 5,
    fontFamily: 'Roboto-Bold',
    letterSpacing: 1,
  },
  subHeaderText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#65000B',
    letterSpacing: 1,
  },
});

export default Dashboard;
