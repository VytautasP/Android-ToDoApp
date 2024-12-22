import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Tile from "./Tile";

export interface TileItem {
  title: string;
  value: string | number;
  color?: string;
}

interface TileListProps {
  items: TileItem[];
  columns?: number; // Optional prop for column count
}

const TileList: React.FC<TileListProps> = ({ items, columns = 2 }) => {
  const tileWidth = (Dimensions.get("window").width - 30 - (columns + 1) * 10) / columns; // Dynamic tile width
  const rows = Math.ceil(items.length / columns);

  return (
    <View style={[styles.tilesContainer, { flexWrap: "wrap" }]}>
      {Array.from({ length: rows }, (_, index) => (
        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {items.slice(index * columns, (index + 1) * columns).map((item, i) => (
            <View key={i} style={{ width: tileWidth }}>
              <Tile item={item} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tilesContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
});

export default TileList;