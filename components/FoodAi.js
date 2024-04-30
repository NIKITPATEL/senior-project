import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';
import { View, TouchableOpacity, Text,StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const TensorCamera = cameraWithTensors(Camera);

const OUTPUT_TENSOR_WIDTH =270;
const OUTPUT_TENSOR_HEIGTH =480;
const CAM_PREVIEW_WIDTH = Dimesions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (9 /16);







const FoodAi = () => {

    const [tfReady,setTfReady] = useState(false);

    useEffect(() => {
        const prepare = async() => {
            await Camera.requestCameraPermissionsAsync();

            await tf.ready();

            //Ready
            setTfReady(true);

        }
        prepare();
    },[]);

    // Handler that will be called when TensorCamera is ready
    const handleCameraStream = async (images,updatePreview,gl) => {
        // Get the tensor form each frame, and feeds this shit to the model 

        const loop = async () => {


        };
        requestAnimationFrame(loop);
        loop();

    };

    if(!tfReady) {
        return (
            <View style={styles.loadingMsg}>
                <Text>Loading ...</Text>
            </View>
        )
    }

    else {
    
    return (
        <View style={{ flex: 1,alignItems:'center',justifyContent:'center',position:'relative',width:CAM_PREVIEW_WIDTH,height:CAM_PREVIEW_HEIGHT,marginTop:Dimesions.get('window').height /2 - CAM_PREVIEW_HEIGHT /2 }}>
            <TensorCamera
                style = {styles.camera}
                autorender = {true}
                type={Camera.Constants.Type.back}
                resizeWidth={OUTPUT_TENSOR_WIDTH}
                resizeHeight={OUTPUT_TENSOR_HEIGTH}
                resizeDepth={3}
                onReady={handleCameraStream}/>
            
        </View>
    );
    }
};


const styles = StyleSheet.create({

    loadingMsg: {
        position:'absolute',
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    camera: {
        width:'100%',
        height:'100%',
        zIndex:1,

    }

})



export default FoodAi;
