import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Home = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('task');
      if (storedTasks !== null) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);

        // Get today's date in the format YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];

        // Filter tasks with a dueDate nearest or equal to today
        const nearestDueTasks = parsedTasks.filter(task => {
          return (
            task.dueDate &&
            new Date(task.dueDate).toISOString().split('T')[0] >= today
          );
        });

        // Sort tasks by dueDate in ascending order
        nearestDueTasks.sort((a, b) => {
          return (
            new Date(a.dueDate).toISOString().split('T')[0] -
            new Date(b.dueDate).toISOString().split('T')[0]
          );
        });

        setFilteredTasks(nearestDueTasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.buttonText}>CREATE/VIEW</Text>
        <Text style={[styles.buttonText]}>TO-DO LIST</Text>
      </TouchableOpacity>
      <IonIcon
        name="refresh-circle"
        size={50}
        onPress={loadTasks}
        color={'#d13c2c'}
      />
      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No tasks are added or due</Text>
      ) : (
        <>
          <Text style={styles.subHeaderText}>Due Tasks</Text>
          <FlatList
            data={filteredTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.taskItem}>
                <Text style={[styles.titleText, styles.titleOutline]}>
                  {item.task}
                </Text>
                <Text style={styles.text}>{item.content}</Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#65000B',
                    fontWeight: '700',
                    fontFamily: 'Roboto-Regular',
                    margin: 5,
                  }}>
                  DUE:{' '}
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleString()
                    : 'Not set'}
                </Text>
                <Text style={styles.completionText}>
                  Completion: {item.completionPercentage}%
                </Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#f7fbfc',
    lineHeight: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#d13c2c',
    width: '100%',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  subHeaderText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#65000B',
  },
  taskItem: {
    padding: 14,
    margin: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#65000B',
  },
  noTasksText: {
    fontSize: 26,
    color: 'black',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 22,
    color: '#65000B',
    marginBottom: 20,
    fontFamily: 'Roboto-Medium',
    margin: 5,
  },
  dateText: {
    color: '#65000B',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    // fontWeight: '700',
    margin: 5,
    marginHorizontal: 2,
    padding: 6,
  },
  titleText: {
    fontSize: 28,
    color: '#65000B',
    padding: 4,
    margin: 5,
    fontFamily: 'Roboto-Bold',
  },
  titleOutline: {
    borderBottomWidth: 1,
    borderColor: '#03045E',
    margin: 4,
    paddingBottom: 4,
  },
  completionText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
