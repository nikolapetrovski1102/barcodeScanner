import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { Table, Input, InputNumber, Space, Form, Button, Row, Col, Modal, message, notification } from 'antd';
import { stringify } from 'ajv';
import Paragraph from 'antd/es/skeleton/Paragraph';
import { calc } from 'antd/es/theme/internal';
import { Axios } from '../Axios';

const { TextArea } = Input;

const columns = [
  {
    title: 'Sifra',
    dataIndex: 'sifra',
    width: '4%',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Opis',
    className: 'opis',
    width: '20%',
    dataIndex: 'opis',
    align: 'left',
  },
  {
    title: 'Kolicina Prenos',
    width: '8%',
    dataIndex: 'kol',
  },
  {
    title: 'Kolicina Sostojba',
    width: '7%',
    dataIndex: 'kol_sos',
  },
  {
    title: 'Cena',
    width: '6%',
    dataIndex: 'cena',
  },
  {
    title: 'Iznos bez DDV',
    width: '10%',
    dataIndex: 'no_ddv',
  },
  {
    title: 'DDV %',
    width: '5%',
    dataIndex: 'ddv_percent',
  },
  {
    title: 'DDV',
    width: '7%',
    dataIndex: 'ddv',
  },
  {
    title: 'iznos so DDV',
    width: '15%',
    dataIndex: 'ddv_amount',
  },
];

const Details = ({ item }) => {  
    const navigate = useNavigate();
    const date = new Date();
    const [dateNow, setDateNow] = useState(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
    const [data, setData] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [cena, setCena] = useState([]);
    const [kolicina, setKolicina] = useState([]);
    const [total, setTotal] = useState(0);
    const [tableClass, setTableClass] = useState('toggle_show');
    const [transferClass, setTransferClass] = useState('toggle_hide');
    const [tableStyle, setTableStyle] = useState('block');
    const [transferStyle, setTransferStyle] = useState('none');
    const [open, setOpen] = useState(false);
    const [kupuva, setKupuva] = useState('');
    const [seriskiBroj, setSeriskiBroj] = useState('');
    const [komada, setKomada] = useState(1);
    const [tableSize, setTableSize] = useState(7);
    const [ispratnicaBroj, setispratnicaBroj] = useState("");
    const [voziloBroj, setVoziloBroj] = useState("");

    const formatNumber = (number) => {
        if (isNaN(number)) return number;
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    const parseFormattedNumber = (formattedNumber) => {
      const cleanedNumber = formattedNumber.replace(/[^0-9.-]+/g, '');
      return parseFloat(cleanedNumber);
  };
  
  const handleChange = (value, element, key) => {
    const newCena = value * element.cena;
    const newKolicina = element.komada - value;
  
    // Update states for cena, kolicina, and komada
    setCena((prevCena) => ({
      ...prevCena,
      [key]: newCena,
    }));
  
    setKolicina((prevKolicina) => ({
      ...prevKolicina,
      [key]: newKolicina,
    }));
  
    setKomada((prevKomada) => ({
      ...prevKomada,
      [key]: value,
    }));

  };
  

  useEffect(() => {
    const handleResize = () => {
      let table_cell = document.querySelector('.ant-table-cell').offsetHeight;
      var calculatedHeight = document.querySelector('#content').offsetHeight - 450;
      setTableSize(calculatedHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

      if (item) {
          const itemsArray = Array.isArray(item) ? item : [item];

          const tableData = Array.from(itemsArray).map((element, _i) => ({
            key: _i,
            sifra: element.sifra,
            opis: element.opis,
            kol: (
                <InputNumber
                    style={{ width: '95%' }}
                    onChange={(value) => handleChange(value, element, _i)}
                    min={1}
                    max={parseInt(kolicina[_i])}
                    defaultValue={1}
                />
            ),
            kol_sos: (kolicina[_i] || element.komada),
            cena: element.cena,
            no_ddv: formatNumber((cena[_i] || element.cena)),
            ddv_percent: 18,
            ddv: formatNumber((cena[_i] || element.cena) * 0.18),
            ddv_amount: formatNumber((cena[_i] || element.cena) * 1.18),
        }));
        
        const totalNoDdv = tableData.reduce((total, item) => total + (parseFormattedNumber(item.no_ddv) || 0), 0);
        const totalDdv = tableData.reduce((total, item) => total + (parseFormattedNumber(item.ddv) || 0), 0);
        const totalDdvAmount = tableData.reduce((total, item) => total + (parseFormattedNumber(item.ddv_amount) || 0), 0);          

          setTotal(totalDdvAmount);

          setData([
              ...tableData,
              {
                  key: 'total',
                  sifra: '',
                  opis: 'Total',
                  kol: '',
                  kol_sos: '',
                  cena: '',
                  no_ddv: formatNumber(totalNoDdv),
                  ddv_percent: '',
                  ddv: formatNumber(totalDdv),
                  ddv_amount: formatNumber(totalDdvAmount),
              },
          ]);
      }
  }, [item, cena, kolicina]);

    const footerStyle = {
        textAlign: 'right',
        paddingRight: '8%',
    };

    const handleContinue = () => {
      if (!kupuva || !seriskiBroj) {
        message.error('Please enter kupuva and seriski broj.');
        return;
      }

      const updatedPreviewData = data.map((item, index) => {
        if (index === item.key) {
          return {
            ...item,
            kol: ( komada[index] || 1 ),
          };
        }
        return item;
      });
  
      setPreviewData(updatedPreviewData);
      setOpen(true);
    }

    const handleGoBack = () => {
        setTransferClass('toggle_hide');
        setTransferStyle('none');
        setTimeout(() => {
            setTableStyle('block');
            setTableClass('toggle_show');
        }, 500);
    }

    const styles = {
      _table: {
        display: tableStyle,
      },
      _form: {
        display: transferStyle,
      }
    }

    const handleOnOkModal = () => {
      if (!ispratnicaBroj && !voziloBroj) {
        message.error('Please enter either ispratnica broj or vozilo broj.');
        return;
      }
      const axios = new Axios();

      const transfer_data = previewData.map(item => {
        return Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key, value.toString()])
        );
      });

      var body_data = {
        transfer_data: JSON.stringify(transfer_data),
        kupuva: kupuva,
        seriskiBroj: seriskiBroj,
        ispratnicaBroj: ispratnicaBroj,
        voziloBroj: voziloBroj,
        type: 'izvoz'
      };

      console.log(body_data);

      axios.post('/api/Data/postTransaction', body_data)
        .then((response) => {
          setOpen(false);
          message.success('Success!');
        })
        .catch((error) => {
          setOpen(false);
          message.error('Something went wrong! Please try again.');
          console.log(error);
        });
    }

    const handleOnCancelModal = () => {
      setOpen(false);
    }

    const handleAddRows = () => {
      console.log(item);
      const serializableData = item.map((_item) => {
        return {
          key: _item.key,
          sifra: _item.sifra,
          opis: _item.opis,
          kol: _item.kol_sos,
          cena: _item.cena,
        };
      })

      const savedTabsClass = localStorage.getItem('tabsClass');
      const savedTransferClass = localStorage.getItem('transferClass');
      const savedColsTransfer = localStorage.getItem('colsTransfer');
      const savedColsTabs = localStorage.getItem('colsTabs');
      const savedRecord = localStorage.getItem('record');

      if (savedTabsClass && savedTransferClass && savedColsTransfer !== null && savedColsTabs !== null && savedRecord !== null) {
        localStorage.removeItem('tabsClass');
        localStorage.removeItem('transferClass');
        localStorage.removeItem('colsTransfer');
        localStorage.removeItem('colsTabs');
        localStorage.removeItem('record');
      }

      navigate('/menu', { state: { record: serializableData } });
    }

    return (
      <>
      {/* Table Transfer */}
      <div className={tableClass} style={styles._table} >
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size='small'
        title={() => 
        <Row>
          <Col span={14}>
            <Form.Item style={{ margin: '0' }} label='Kupuva'>
              <TextArea
                onChange={(e) => setKupuva(e.target.value)}            
                variant='filled'
                style={{ width: '30%' }}
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
                placeholder='Kupuva' 
              />
            </Form.Item>
          </Col>
          
          <Col span={10}>
            <Form.Item label='Data na faktura' style={{ display: 'flex', justifyContent: 'right', marginBlock: '1%' }}>
              <span>Skopje, {dateNow}</span>
            </Form.Item>
      
            <Form.Item 
              label='Seriski broj'
              labelCol={{ span: 20 }}
              wrapperCol={{ span: 4 }}
              style={{ padding: '0', marginBottom: '1%' }}
            >
              <Input
                type='text'
                onChange={(e) => setSeriskiBroj(e.target.value)}
                variant='filled'
                size='small'
                suffix={`/${new Date().getFullYear().toString().substr(-2)}`} 
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        }
        footer={() => (
            <div style={footerStyle}>
                Total: <strong>{formatNumber(total)}</strong>
            </div>
        )}
        scroll={{
          y: tableSize,
        }}
      />
      <Button type="dashed" onClick={() => handleAddRows()} style={{ marginRight: '1%' }} >
        Add more
      </Button>
      <Button type="primary" onClick={() => handleContinue()}>
        Continue
      </Button>
      </div>
      {/* Form input */}
      <Modal
        style={{ top: 20 }}
        title="Faktura"
        open={open}
        onOk={() => handleOnOkModal()}
        onCancel={() => handleOnCancelModal()}
        width={'75%'}
      >
        <div style={{ display: 'flex', alignItems: 'center', margin: '1% 0 1% 0' }}>
          <p style={{ margin: 0 }}>
            So ispratnica broj <span>{seriskiBroj}</span> - 
            <span>
              <Input
                onChange={(e) => setispratnicaBroj(e.target.value)}
                style={{
                  width: '3%',
                  border: 'none',
                  borderBottom: '1px solid',
                  backgroundColor: 'transparent',
                  padding: 0,
                  margin: 0,
                }}
              />
            </span>
            <span>/{new Date().getFullYear()}</span> od {dateNow} god so vozilo br. <span>
              <Input
                variant='borderless'
                onChange={(e) => setVoziloBroj(e.target.value)}
                style={{
                  width: '7%',
                  border: 'none',
                  borderBottom: '1px solid',
                  backgroundColor: 'transparent',
                  padding: 0,
                  margin: 0,
                }}
              />
            </span> isporachano e:
          </p>
        </div>
        {/* Table */}
        <Table
        columns={columns}
        dataSource={previewData}
        bordered
        size='small'
        title={() => (
          // Header
      <Row>
        <Col span={14}>
          <Form.Item style={{ margin: '0' }} label='Kupuva'>
            <TextArea
              value={kupuva}
              disabled
              variant='borderless'
              style={{ width: '30%', color: '#fff' }}
              autoSize={{
                minRows: 3,
                maxRows: 5,
              }}
              placeholder='Kupuva' 
            />
          </Form.Item>
        </Col>
      
          <Col span={10}>
            <Form.Item label='Data na faktura' style={{ display: 'flex', justifyContent: 'right', marginBlock: '1%' }}>
              <span>Skopje, {dateNow}</span>
            </Form.Item>
      
            <Form.Item 
              label='Seriski broj'
              labelCol={{ span: 20 }}
              wrapperCol={{ span: 4 }}
              style={{ padding: '0', marginBottom: '1%' }}
            >
              <Input
                type='text'
                value={seriskiBroj}
                disabled
                variant='borderless'
                size='small'
                suffix={`/${new Date().getFullYear().toString().substr(-2)}`} 
                style={{ width: '100%', color: '#fff' }}
              />
            </Form.Item>
          </Col>
        </Row> )}
        // End Header
        footer={() => (
            <div style={footerStyle}>
                Total: <strong>{formatNumber(total)}</strong>
            </div>
        )}
        scroll={{
          y: 50 * tableSize,
        }}
      />
      {/* End Table */}
      <p> Plaawe vo rok od 60 dena od datumot na promet, po ovoj rok zasmetuvame zakonska zatezna kamata i ednokraten nadomest (3.000 denari) soglasno Zakonot za finansiska disciplina.
      Reklamacija vo rok od 3 dena, so ureden komisiski zapisnik.
      Vo slu~aj na spor nadle`en e Osnovniot Sud vo Skopje</p>

      </Modal>
      </>
    );
  };
export default Details;