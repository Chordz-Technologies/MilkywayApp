import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { UPDATE_CONFIG } from '../utils/updateConfig';

interface Props {
    visible: boolean;
    forceUpdate: boolean;
    onClose: () => void;
}

const UpdateModal: React.FC<Props> = ({ visible, forceUpdate, onClose }) => {
    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>

                    <Text style={styles.title}>Update Available 🚀</Text>
                    <Text style={styles.desc}>
                        A new version of the app is available. Please update to enjoy the latest features.
                    </Text>

                    <TouchableOpacity
                        style={styles.updateBtn}
                        onPress={() => Linking.openURL(UPDATE_CONFIG.PLAY_STORE_URL)}
                    >
                        <Text style={styles.updateText}>Update Now</Text>
                    </TouchableOpacity>

                    {!forceUpdate && (
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.later}>Maybe Later</Text>
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        </Modal>
    );
};

export default UpdateModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    desc: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
        color: '#555',
    },
    updateBtn: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
    },
    updateText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    later: {
        marginTop: 15,
        textAlign: 'center',
        color: '#888',
    },
});