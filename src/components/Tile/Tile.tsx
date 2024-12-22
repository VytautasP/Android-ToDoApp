import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { TileItem } from "./TileList";

export interface TileProps {
  item: TileItem
}

const Tile: React.FC<TileProps> = ({item}: TileProps) => {
    return (

        <Card style={{ margin: 10, padding: 10, backgroundColor: item.color? item.color : '#e3f2fd' }}>
            <Text style={{ fontSize: 12 }}>{item.title}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{item.value}</Text>
        </Card>
    );
};

const styles = StyleSheet.create({
  tile: {
    height: 55,
    flex: 1,
    margin: 5,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e3f2fd",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tileTitle: {
    fontSize: 11,
    color: "#333",
    marginBottom: 5,
  },
  tileValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Tile;