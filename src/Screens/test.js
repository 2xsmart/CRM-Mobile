import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { TextInput, RadioButton } from 'react-native-paper';
import DateTimePicker from "@react-native-community/datetimepicker";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { format } from "date-fns";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { iconsize } from '../../Constants/dimensions';
import styles from './Styles/DashboardStyle';

// Reusable wrapper for label + input
const FieldWrapper = ({ label, children }) => (
  <>
    <View style={styles.labelbox}>
      <Text>{label}</Text>
    </View>
    {children}
  </>
);

// Mapping for system fields
const systemFields = {
  UID: (field, Job) => (
    <FieldWrapper label={field.name}>
      <TextInput mode="outlined" style={styles.input} value={Job.UID} editable={false} />
    </FieldWrapper>
  ),

  'Job Id': (field, Job, handleJob) => (
    <FieldWrapper label={field.name}>
      <TextInput
        mode="outlined"
        outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
        style={styles.input}
        value={Job.JobId}
        onChangeText={(text) => handleJob("JobId", text)}
      />
    </FieldWrapper>
  ),

  Status: (field, Job, handleJob, { Status, selectedoption }) => (
    <FieldWrapper label={field.name}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        selectedStyle={{ backgroundColor: 'orange' }}
        itemTextStyle={styles.itemTextStyle}
        inputSearchStyle={{ height: 35 }}
        data={Status}
        search
        labelField="name"
        valueField="name"
        placeholder="Select Status"
        searchPlaceholder="Search..."
        value={Job.Status}
        onChange={item => handleJob('Status', item.name)}
        renderItem={(item) => selectedoption(item.name, Job.Status)}
      />
    </FieldWrapper>
  ),

  'Sub-Status': (field, Job, handleJob, { SubStatus, selectedoption }) => (
    <FieldWrapper label={field.name}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        inputSearchStyle={{ height: 35 }}
        data={SubStatus}
        search
        maxHeight={300}
        labelField="name"
        valueField="name"
        placeholder="Select Sub Status"
        searchPlaceholder="Search..."
        value={Job.SubStatus}
        onChange={item => handleJob('SubStatus', item.name)}
        renderItem={(item) => selectedoption(item.name, Job.SubStatus)}
      />
    </FieldWrapper>
  ),

  Owner: (field, Job, handleJob, { Owner, selectedoption }) => (
    <FieldWrapper label={field.name}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        inputSearchStyle={{ height: 35 }}
        data={Owner}
        search
        maxHeight={300}
        labelField="name"
        valueField="name"
        placeholder="Select Owner"
        searchPlaceholder="Search..."
        value={Job.Owner}
        onChange={item => handleJob('Owner', item.name)}
        renderItem={(item) => selectedoption(item.name, Job.Owner)}
      />
    </FieldWrapper>
  ),

  Client: (field, Job, handleJob, { Client, selectedoption }) => (
    <FieldWrapper label={field.name}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        inputSearchStyle={{ height: 35 }}
        data={Client}
        search
        maxHeight={300}
        labelField="name"
        valueField="name"
        placeholder="Select Client"
        searchPlaceholder="Search..."
        value={Job.Client}
        onChange={item => handleJob('Client', item.name)}
        renderItem={(item) => selectedoption(item.name, Job.Client)}
      />
    </FieldWrapper>
  ),

  AssignTo: (field, Job, handleJob, { Users, displayText, selectedoptions }) => (
    <FieldWrapper label={field.name}>
      <MultiSelect
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholder={displayText(Job.AssignTo)}
        placeholderStyle={{
          color: Job?.AssignTo && Job.AssignTo.length > 0 ? '#000' : '#999',
          fontSize: 14
        }}
        selectedStyle={{ display: 'none' }}
        selectedTextStyle={{ color: 'transparent' }}
        itemTextStyle={styles.itemTextStyle}
        inputSearchStyle={{ height: 35 }}
        searchPlaceholder="Search..."
        data={Users}
        search
        labelField="fullname"
        valueField="fullname"
        multiple
        maxHeight={300}
        value={Job.AssignTo}
        onChange={item => handleJob('AssignTo', item)}
        renderItem={(item) => selectedoptions(item, 'fullname', Job.AssignTo)}
      />
    </FieldWrapper>
  ),
};

// Main renderer
function renderField(field, Job, form, helpers) {
  // First check system fields
  if (systemFields[field.code]) {
    return systemFields[field.code](field, Job, helpers.handleJob, helpers);
  }

  // Handle dynamic types
  switch (field.type) {
    case 'text':
    case 'textArea':
      return (
        <FieldWrapper label={field.name}>
          <TextInput
            mode="outlined"
            style={styles.input}
            outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
            placeholder={`Enter ${field.name}`}
            value={form[field.id]}
            placeholderTextColor="#999"
            onChangeText={(text) => helpers.handleJobData(field.id, text)}
          />
        </FieldWrapper>
      );

    case 'number':
      return (
        <FieldWrapper label={field.name}>
          <TextInput
            mode="outlined"
            style={styles.input}
            outlineStyle={{ borderColor: '#71717B', borderWidth: 1 }}
            keyboardType="number-pad"
            placeholder={`Enter ${field.name}`}
            value={form[field.id] ? String(form[field.id]) : ""}
            placeholderTextColor="#999"
            onChangeText={(text) => helpers.handleJobData(field.id, text)}
          />
        </FieldWrapper>
      );

    case 'singleSelect':
      return (
        <FieldWrapper label={field.name}>
          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
            inputSearchStyle={{ height: 35 }}
            data={field.options}
            search
            maxHeight={300}
            labelField="name"
            valueField="value"
            placeholder={`Select ${field.name}`}
            searchPlaceholder="Search..."
            value={form[field.id]}
            onChange={item => helpers.handleJobData(field.id, item.value)}
            renderItem={(item) => helpers.selectedoption(item.name, form[field.id])}
          />
        </FieldWrapper>
      );

    case 'multiSelect':
      return (
        <FieldWrapper label={field.name}>
          <MultiSelect
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholder={helpers.displayText(form[field.id], field.name)}
            placeholderStyle={{ color: form[field.id]?.length > 0 ? '#000' : '#999' }}
            selectedStyle={{ display: 'none' }}
            selectedTextStyle={{ color: 'transparent' }}
            itemTextStyle={styles.itemTextStyle}
            inputSearchStyle={{ height: 35 }}
            searchPlaceholder="Search..."
            data={field.options}
            search
            labelField="name"
            valueField="value"
            multiple
            maxHeight={300}
            value={form[field.id]}
            onChange={items => helpers.handleJobData(field.id, items)}
            renderItem={(item) => helpers.selectedoptions(item, 'value', form[field.id])}
          />
        </FieldWrapper>
      );

    case 'radio':
      return (
        <FieldWrapper label={field.name}>
          <View style={styles.row}>
            {field.options.map((item) => (
              <View key={item.value} style={styles.option}>
                <View style={{ transform: [{ scale: 0.8 }] }}>
                  <RadioButton
                    value={item.value}
                    status={form[field.id] === item.value ? "checked" : "unchecked"}
                    onPress={() => helpers.handleJobData(field.id, item.value)}
                  />
                </View>
                <Text>{item.name}</Text>
              </View>
            ))}
          </View>
        </FieldWrapper>
      );

    case 'date':
      return (
        <FieldWrapper label={field.name}>
          <TouchableOpacity style={styles.calendar}>
            <FontAwesome5
              name="calendar-alt"
              size={helpers.iconsize.sm}
              color="#FFF"
              style={{
                backgroundColor: '#0343CE',
                width: '12%',
                paddingLeft: 10,
                paddingVertical: 6
              }}
              onPress={() => helpers.setShow(field.id)}
            />
            <Text style={{ width: '100%', paddingVertical: 10 }}>
              {form[field.id]}
            </Text>
          </TouchableOpacity>
          {helpers.show === field.id && (
            <DateTimePicker
              value={helpers.parseDate(form[field.id])}
              mode="date"
              display="default"
              onChange={(event, selectedDate) =>
                helpers.handleDateChange(field.id, event, selectedDate)
              }
            />
          )}
        </FieldWrapper>
      );

    case 'file':
      return (
        <FieldWrapper label={field.name}>
          <TextInput
            mode="outlined"
            style={styles.input}
            placeholder={`Enter ${field.name}`}
            value={form[field.id]}
            placeholderTextColor="#999"
            editable={false}
          />
        </FieldWrapper>
      );

    default:
      return null;
  }
}
