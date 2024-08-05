import React, { useState } from "react";
import { View, Text, Modal, Button, StyleSheet, Image } from "react-native";
import { RNCamera } from "react-native-camera";
import BarcodeMask from "react-native-barcode-mask";
import { CameraView } from "expo-camera";

const Scanner = ({ route }) => {

  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState({ data: "", type: "" });
  const [isScanning, setIsScanning] = useState(true);

  const onBarCodeRead = ({ data, type }) => {
    if (!isScanning) return;

    setBarcodeData({ data, type });

    setBarcodeScanned(true);
    setIsScanning(false);
  };

  const handleClose = () => {
    setBarcodeScanned(false);
    setIsScanning(true);
    console.log("Modal closed");
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={ isScanning ? onBarCodeRead : undefined }
        captureAudio={false}
      >
        <BarcodeMask
          width={350}
          height={150}
          showAnimatedLine={false}
          outerMaskOpacity={0.8}
        />
      </CameraView>

      <Modal
        visible={barcodeScanned}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {route.params.data.data == barcodeData.data && (
              <>
                <Text style={styles.modalText}>DATA: {route.params.data.data}</Text>
                <Text style={styles.modalText}>TYPE: {route.params.data.type}</Text>
                <Image
                  source={{ uri: route.params.data.photo }}
                  style={styles.image}
                />
                <Text style={styles.modalText}>STOCK: {route.params.data.stock}</Text>
                <Text style={styles.modalText}>PRICE: ${route.params.data.price}</Text>
              </>
            ) || 
            <>
              <Text style={styles.modalText}>No info for scanned data:</Text>
              <Text style={styles.modalText}>DATA: {barcodeData.data}</Text>
              <Text style={styles.modalText}>TYPE: {barcodeData.type}</Text>
            </>
            }
            <Button title="Close" onPress={handleClose} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
  },
  image:{
    width: 200,
    height: 200,
  }
});

export default Scanner;
