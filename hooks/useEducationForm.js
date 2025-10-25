import { useState, useCallback } from 'react';

export function useEducationForm(initialValues = {}) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const updateFields = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback((newValues = initialValues) => {
    setFormData(newValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const validateField = useCallback((field, value, rules = {}) => {
    if (rules.required && !value) {
      return 'Dit veld is verplicht';
    }
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimaal ${rules.minLength} karakters vereist`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximaal ${rules.maxLength} karakters toegestaan`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Ongeldig formaat';
    }
    return null;
  }, []);

  const validate = useCallback((validationRules = {}) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field], validationRules[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const handleSubmit = useCallback(async (onSubmit, validationRules = {}) => {
    setIsSubmitting(true);
    
    if (validationRules && Object.keys(validationRules).length > 0) {
      const isValid = validate(validationRules);
      if (!isValid) {
        setIsSubmitting(false);
        return { success: false, error: 'Validatie mislukt' };
      }
    }

    try {
      const result = await onSubmit(formData);
      setIsSubmitting(false);
      return result;
    } catch (error) {
      setIsSubmitting(false);
      return { success: false, error: error.message };
    }
  }, [formData, validate]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateFields,
    resetForm,
    validate,
    handleSubmit,
    setFormData
  };
}
