import { Text } from '@/components/Text';
import { COLORS } from '@/utils/colors';
import { BORDER_RADIUS, FONT_SIZES } from '@/utils/constants';
import { ChevronDown } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type SelectItem = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  items: SelectItem[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export const CustomSelect = ({
  items,
  value,
  onValueChange,
  placeholder = 'Select an option',
}: CustomSelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find((item) => item.value === value);

  const handleSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setModalVisible(true)}>
        <Text style={selectedItem ? styles.valueText : styles.placeholderText}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <ChevronDown />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={items}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text style={styles.itemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    padding: 12,
    backgroundColor: COLORS.card,
    minHeight: 44,
  },
  placeholderText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.medium,
  },
  valueText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.medium,
    padding: 10,
    width: '80%',
    maxHeight: '60%',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
  },
});
