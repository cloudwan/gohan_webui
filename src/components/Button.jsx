import React from 'react';
import ProtoTypes from 'prop-types';
import {
  Button as BlueprintButton,
  Intent as BlueprintIntent,
} from '@blueprintjs/core';

export const Button = (
  {
    active = false,
    disabled = false,
    loading = false,
    isMinimal = false,
    className = '',
    iconName,
    rightIconName,
    onClick,
    type = 'button',
    text,
    intent = BlueprintIntent.NONE
  }
) => (
  <BlueprintButton className={`${className}${isMinimal ? ' pt-minimal' : ''}`}
    active={active}
    disabled={disabled}
    iconName={iconName}
    rightIconName={rightIconName}
    loading={loading}
    onClick={onClick}
    type={type}
    intent={intent}>
    {text}
  </BlueprintButton>
);

export default Button;

if (process.env.NODE_ENV !== 'production') {
  Button.propTypes = {
    active: ProtoTypes.bool,
    disabled: ProtoTypes.bool,
    loading: ProtoTypes.bool,
    isMinimal: ProtoTypes.bool,
    iconName: ProtoTypes.string,
    rightIconName: ProtoTypes.string,
    onClick: ProtoTypes.func,
    type: ProtoTypes.string,
    text: ProtoTypes.string,
    intent: ProtoTypes.number,
    className: ProtoTypes.string,
  };
}
