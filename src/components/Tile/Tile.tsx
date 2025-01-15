import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { TileItem } from "./TileList";
import globalStyles from '../../style/style'

export interface TileProps {
  item: TileItem
}

const Tile: React.FC<TileProps> = ({item}: TileProps) => {
    return (
        <Card style={{ margin: 10, padding: 10, backgroundColor: item.color? item.color : '#e3f2fd' }}>
            <Text style={[{ fontSize: 12 }, globalStyles.textColor]}>{item.title}</Text>
            <Text style={[{ fontWeight: 'bold', fontSize: 14 }, globalStyles.textColor]}>{item.value}</Text>
        </Card>
    );
};

export default Tile;