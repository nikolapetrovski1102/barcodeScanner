import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Input, InputNumber, Select, AutoComplete, Spin, message } from 'antd';
import { Axios } from '../../Components/Axios';

const axios = new Axios();

const debounce = (func, delay) => {
  let debounceTimeout;
  return (...args) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func(...args), delay);
  };
};

const formItemLayout = {
  labelCol: {
      xs: { span: 8 },
      sm: { span: 6 },
  },
  wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
  },
  span: 2,
};

const AddNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state?.record || null;
  const current_table = location.state?.table || "";
  const [form] = Form.useForm();
  const [headTypes, setHeadTypes] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [sifri, setSifri] = useState([]);
  const [headTypeSelected, setHeadTypeSelected] = useState('');
  const [calculatedKomada, setCalculatedKomada] = useState(0);
  const [komadaState, setKomadaState] = useState(0);
  const [spinning, setSpinning] = useState(false);

  // Fetch initial data on mount
  useEffect(() => {
    setHeadTypes([{
      value: 'adapteri_nipli',
      label: 'adapteri_nipli',
    }]);

    if (record){
      form.setFieldsValue({
        head_type: record?.head_type || '',
        type: record?.type || '',
        sifra: record?.sifra.toString() || '',
        cena: record?.cena || '',
        opis: record?.opis || '',
        komada: ''
      });

      const parsedKomada = parseInt(record?.komada || 0, 10);
      setKomadaState(parsedKomada || 0);
      setDisabled(false);
    }

    if (current_table)
      onChangeHeadType(current_table);

  }, []);

  const onFinish = useCallback((values) => {
    setSpinning(true);
    values.komada = calculatedKomada;
    if (values.sifra.toString().includes('-'))
      values.sifra = values.sifra.split('-')[0].trim();

    console.log(values);

    axios.post('/api/Data/addItems', values)
    .then((succ) => {
      console.log('Success:', succ)
      message.success('Success!')
      setSpinning(false);
      setTimeout( () => {
        navigate('/menu');
      }, 1000);
    })
    .catch((err) => {
      console.error('Error:', err)
      message.error('Error!')
      setSpinning(false);
      setTimeout( () => {
        navigate('/menu');
      }, 1000)
    });

    form.resetFields();
    setKomadaState(0);
    setCalculatedKomada(0);
  }, [calculatedKomada]);

  const onChangeCallBack = useCallback(
    debounce((value) => {
      const sifra = value.split('-')[0].trim();
      axios
        .get(`/api/Data/getItemByHeadTypeAndSifra?head_type=${encodeURIComponent(headTypeSelected)}&sifra=${encodeURIComponent(sifra)}`)
        .then((response) => {
          const item = response.data[0];
          form.setFieldsValue({
            type: item?.type || '',
            cena: item?.cena || '',
            opis: item?.opis || '',
          });
          const parsedKomada = parseInt(item?.komada || 0, 10);
          setKomadaState(parsedKomada || 0);
          setSpinning(false);
        })
        .catch((err) => { 
          console.error('Error fetching item:', err)
          setSpinning(false);
        });
    }, 600),
    [headTypeSelected, form]
  );

  const onChange = (value) => {
    setSpinning(true);
    onChangeCallBack(value);
  }

  const onChangeKomada = useCallback((value) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      setCalculatedKomada(parsedValue + komadaState);
    }
  }, [komadaState]);

  const onChangeHeadType = useCallback((value) => {
    setSpinning(true);
    axios.get(`/api/Data/getHeadTypes?head_type=${encodeURIComponent(value)}`)
      .then((response) => {
        setSifri(response.data);
        setHeadTypeSelected(value);
        setSpinning(false);
        setDisabled(false);
      })
      .catch((err) => {
        console.error('Error fetching head types:', err);
        setSpinning(false);
        setDisabled(true);
      });
  }, []);

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="detailsForm"
      onFinish={onFinish}
      wrapperCol={{ span: 10 }}
      style={{ padding: '1% 0 0 2%' }}
    >

      <Form.Item labelCol={{ span: formItemLayout.span }} labelAlign="left" name="head_type" label="Head Type" required>
        <Select options={headTypes} onChange={onChangeHeadType} defaultValue={current_table} >
          {/* {headTypes.map((head_type) => (
            <Select.Option label={head_type} value={head_type}>{head_type}</Select.Option>
          ))} */}
        </Select>
      </Form.Item>

      <Form.Item labelCol={{ span: formItemLayout.span }} labelAlign="left" name="type" label="Type" required>
        <Input  disabled={disabled} />
      </Form.Item>

      <Form.Item labelCol={{ span: formItemLayout.span }} labelAlign="left" name="sifra" label="Sifra" required>
        <AutoComplete
          options={sifri}
          onChange={onChange}
          disabled={disabled}
          filterOption={(inputValue, option) =>
            option.value.split("-")[0].trim().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>

      <Form.Item labelCol={{ span: formItemLayout.span }} labelAlign="left" name="opis" label="Opis" required>
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item labelCol={{ span: formItemLayout.span }} labelAlign="left" name="cena" label="Cena" required>
        <InputNumber disabled={disabled} />
      </Form.Item>

      <Form.Item labelCol={{ span: formItemLayout.span }} labelAlign="left" name="komada" label="Komada" required>
        <InputNumber addonBefore={komadaState} onChange={onChangeKomada} disabled={disabled} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
        <Button style={{ marginTop: '5%' }} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <Spin spinning={spinning} fullscreen />
    </Form>
  );
};

export default AddNew;
