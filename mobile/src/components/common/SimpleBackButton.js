// mobile/src/components/common/SimpleBackButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import ProfessionalIcon from './ProfessionalIcon';
import { COLORS } from '../../utils/constants';

const SimpleBackButton = ({ 
  onPress, 
  style = {}, 
  iconColor = COLORS.dark,
  backgroundColor = 'rgba(255, 255, 255, 0.95)',
  size = 48 
}) => {
  return (
    <TouchableOpacity
      style={[styles.backButton, { backgroundColor, width: size, height: size, borderRadius: size / 2 }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ProfessionalIcon 
        name="arrow-back-outline"
        type="ionicons"
        size={20}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
});

export default SimpleBackButton;