import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Input, Form,Row, Col, message, Spin } from 'antd';
import { Axios } from '../../Axios';

const { TextArea } = Input;
const axios = new Axios();

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

const Details = () => {  
    const navigate = useNavigate();
    const location = useLocation();
    const record = location.state?.record || [];
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
    const [item, setItem] = useState([]);
    const isInitialMount = useRef(true);
    const [spinning, setSpinning] = useState(true);
    
    const showMessage = () => {
      message.success('Success!');
    };

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

    let transaction_id = record.ID ?? null;

    axios.get(`/api/Data/getTransactionDetails/${transaction_id}`)
    .then(res => {
      var parsed_data = JSON.parse(res.data[0].meta_value);
      setData(parsed_data);
      setTotal(parsed_data[parsed_data.length - 1].ddv_amount);
      setSpinning(false);
    })
    .catch(err => {
      console.log(err);
    })

    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
  
    if (record){
        Array.from(data).map((elem, _i) => {
            if (_i < record.no_items) {
                item.push(elem);
            }
        })
    }

      if (item) {
          const itemsArray = Array.isArray(item) ? item : [item];

          const tableData = Array.from(itemsArray).map((element, _i) => ({
            key: _i,
            sifra: element.sifra,
            opis: element.opis,
            kol: ((element.komada - (element.komada - _i) )),
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
      setOpen(false);
      showMessage();
    }

    const handleOnCancelModal = () => {
      setOpen(false);
    }

    const handleAddRows = () => {
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
                // onChange={(e) => setKupuva(e.target.value)}            
                disabled
                value={'Do kogo'}
                variant='filled'
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
                // onChange={(e) => setSeriskiBroj(e.target.value)}
                variant='filled'
                disabled
                value={'123'}
                size='small'
                suffix={`/${new Date().getFullYear().toString().substr(-2)}`} 
                style={{ width: '100%', color: '#fff' }}
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
          y: 60 * 7,
        }}
      />
      </div>
      {/* Form input */}
      <Spin spinning={spinning} fullscreen />
      </>
    );
  };
export default Details;