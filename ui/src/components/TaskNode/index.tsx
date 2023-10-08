import React, { useState } from "react";
import "reactflow/dist/style.css";
import { Card } from "evergreen-ui";
import { Item } from "../../hooks/useItems";



import styles from "./TaskNode.module.css";


interface ItemNodeProps {
  data: {
    item: Item;
  };
}

export type ValidationErrors = Record<string, string[]>;

export default function ItemNode({ data }: ItemNodeProps) {
  const { item } = data;
  const [managedItem, setManagedItem] = useState<Item>(item);

  if (!managedItem) {
    return null;
  }

  return (
    <Card elevation={1} className={styles.taskNodeCard} background="tint1">


    </Card>
  );
}
