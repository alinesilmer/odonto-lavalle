"use client";

import type React from "react";

import type { ChangeEvent } from "react";
import styles from "./Input.module.scss";

interface InputProps {
  type?: "text" | "email" | "tel" | "password";
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  disabled = false,
}) => {
  return (
    <div className={styles.inputWrapper}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`${styles.input} ${error && touched ? styles.error : ""}`}
      />
      {error && touched && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
