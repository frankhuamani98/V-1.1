import React, { useState } from 'react';
import { 
  Card, Typography, Divider, Space, Button, Avatar, 
  Tag, Row, Col, List, Input, Form, Badge, Tabs, 
  Upload, message, Descriptions, Statistic, 
  Modal, InputNumber, Steps, Alert, Switch, Radio 
} from 'antd';
import { 
  UserOutlined, MailOutlined, PhoneOutlined, EditOutlined,
  CarOutlined, CameraOutlined, CheckOutlined, 
  HistoryOutlined, PlusOutlined, DeleteOutlined, 
  IdcardOutlined, VerifiedOutlined, KeyOutlined, 
  LoadingOutlined, CheckCircleOutlined, ManOutlined, 
  WomanOutlined, StarFilled, ShoppingOutlined, SafetyCertificateFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

// Paleta de colores mejorada
const colors = {
  primary: '#4361ee',
  primaryLight: '#5a75f1',
  secondary: '#3a0ca3',
  accent: '#4cc9f0',
  success: '#2ecc71',
  successLight: '#58d68d', // Add a lighter shade for success
  warning: '#f39c12',
  error: '#e74c3c',
  dark: '#2c3e50',
  light: '#f8f9fa',
  text: '#34495e'
};

// Estilos reutilizables mejorados
const cardStyle = {
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  border: 'none',
  overflow: 'hidden'
};

const iconContainerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  marginRight: 12,
  background: 'rgba(67, 97, 238, 0.1)'
};

const iconStyle = {
  fontSize: 18,
  color: colors.primary
};

interface Bike {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  image: string;
}

interface UserData {
  name: string;
  username: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  stats: {
    orders: number;
    rating: number;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    secondLastName: string;
    dni: string;
    birthDate: string;
    address: string;
    gender: string;
    license: string;
    bloodType: string;
  };
}

const MotoUserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('info');
  const [avatar, setAvatar] = useState('https://randomuser.me/api/portraits/men/45.jpg');
  const [bikes, setBikes] = useState<Bike[]>([
    {
      id: 1,
      brand: 'Yamaha',
      model: 'YZF-R6',
      year: 2019,
      plate: 'ABC-1234',
      image: 'https://www.yamaha-motor.com.br/uploads/bikes/YZF-R6-AZUL-2020-MY22-1.png'
    },
    {
      id: 2,
      brand: 'Honda',
      model: 'CBR600RR',
      year: 2017,
      plate: 'XYZ-5678',
      image: 'https://www.honda.com.br/motos/sites/hda/files/2021-11/cbr600rr_0.png'
    }
  ]);
  const [isAddBikeModalVisible, setIsAddBikeModalVisible] = useState(false);
  const [newBikeForm] = Form.useForm();
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [passwordSteps, setPasswordSteps] = useState(0);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('email');

  const [userData, setUserData] = useState<UserData>({
    name: 'Carlos Motero',
    username: '@carlosmoto',
    role: 'Usuario Premium',
    bio: 'Apasionado por las motos y los viajes en carretera. Miembro activo de la comunidad motera desde 2015.',
    email: 'carlos@motero.com',
    phone: '+51 916 184 836',
    location: 'Lima, España',
    joinDate: 'Miembro desde Enero 2026',
    stats: {
      orders: 142,
      rating: 4.8
    },
    personalInfo: {
      firstName: 'Carlos',
      lastName: 'Motero',
      secondLastName: 'Perez',
      dni: '12345678',
      birthDate: '1985-06-15',
      address: 'Av. Las Motos 123, Lima 15023',
      gender: 'male',
      license: 'A-12345678',
      bloodType: 'O+'
    }
  });

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        setUserData({
          ...userData,
          username: values.username,
          email: values.email,
          phone: values.phone
        });
        message.success('Perfil actualizado correctamente');
        setEditMode(false);
      })
      .catch(err => message.error('Complete los campos requeridos'));
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) message.error('Solo imágenes JPG/PNG!');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error('Imagen debe ser <2MB!');
    return isJpgOrPng && isLt2M;
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done' && info.file.originFileObj) {
      setAvatar(URL.createObjectURL(info.file.originFileObj));
      message.success('Foto actualizada!');
    }
  };

  const handleAddBike = () => {
    newBikeForm.validateFields()
      .then(values => {
        const newBike = {
          ...values,
          id: Date.now(),
          image: `https://via.placeholder.com/300x200?text=${values.brand}+${values.model}`
        };
        setBikes([...bikes, newBike]);
        message.success('Moto añadida correctamente');
        setIsAddBikeModalVisible(false);
        newBikeForm.resetFields();
      })
      .catch(err => message.error('Complete los campos requeridos'));
  };

  const handleDeleteBike = (id: number) => {
    setBikes(bikes.filter(bike => bike.id !== id));
    message.success('Moto eliminada');
  };

  const handleVerifyAccount = () => {
    setVerificationModalVisible(true);
  };

  const handleVerificationSubmit = () => {
    setPasswordSteps(1);
    setTimeout(() => {
      if (verificationCode === '123456') {
        setVerificationStatus(true);
        setPasswordSteps(2);
        message.success('Cuenta verificada exitosamente');
        setTimeout(() => {
          setVerificationModalVisible(false);
          setPasswordSteps(0);
        }, 1500);
      } else {
        message.error('Código de verificación incorrecto');
        setPasswordSteps(0);
      }
    }, 1500);
  };

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true);
  };

  const handlePasswordSubmit = () => {
    setPasswordSteps(1);
    setTimeout(() => {
      setPasswordSteps(2);
      message.success('Contraseña cambiada exitosamente');
      setTimeout(() => {
        setChangePasswordModalVisible(false);
        setPasswordSteps(0);
      }, 1500);
    }, 1500);
  };

  const sendVerificationCode = () => {
    message.info(`Código enviado por ${verificationMethod === 'email' ? 'correo electrónico' : 'WhatsApp'}`);
    setPasswordSteps(1);
    setTimeout(() => setPasswordSteps(0), 2000);
  };

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '24px 16px',
      background: colors.light,
      minHeight: '100vh'
    }}>
      <Card
        bordered={false}
        style={{ 
          ...cardStyle,
          borderTop: `4px solid ${colors.primary}`,
          background: 'white'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header con avatar y stats */}
        <div style={{ 
          padding: 24,
          background: `linear-gradient(135deg, ${colors.light} 0%, white 100%)`,
          borderBottom: `1px solid #e8e8e8`
        }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Badge
                count={
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleAvatarChange}
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => onSuccess && onSuccess('ok'), 0);
                    }}
                  >
                    <Button
                      shape="circle"
                      icon={<CameraOutlined />}
                      style={{
                        backgroundColor: colors.primary,
                        color: 'white',
                        border: '2px solid white',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }}
                    />
                  </Upload>
                }
                offset={[-20, 100]}
              >
                <Avatar
                  size={160}
                  src={avatar}
                  icon={<UserOutlined />}
                  style={{
                    border: `4px solid ${colors.primary}`,
                    boxShadow: `0 8px 24px rgba(67, 97, 238, 0.3)`
                  }}
                />
              </Badge>
              
              <Title level={3} style={{ marginTop: 16, marginBottom: 0, color: colors.dark }}>
                {userData.name}
              </Title>
              
              <Tag 
                color={colors.primary} 
                style={{ 
                  marginTop: 8,
                  fontSize: 14,
                  padding: '4px 12px',
                  fontWeight: 600,
                  borderRadius: 12
                }}
              >
                {userData.role}
              </Tag>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: 16,
                gap: 8
              }}>
                <Tag icon={<StarFilled style={{ color: colors.warning }} />} color="#fff">
                  {userData.stats.rating}/5
                </Tag>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 500,
                    height: 40
                  }}
                  icon={<ShoppingOutlined />}
                  block
                >
                  Historial de Pedidos
                </Button>
              </div>
            </Col>
            
            <Col xs={24} md={18}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Text style={{ 
                    fontSize: 16, 
                    color: colors.text,
                    lineHeight: 1.6
                  }}>
                    {userData.bio}
                  </Text>
                </div>
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Card 
                      bordered={false} 
                      style={{ 
                        background: `linear-gradient(135deg, ${colors.light} 0%, #ffffff 100%)`,
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Statistic
                        title={<Text style={{ color: colors.text }}>Pedidos realizados</Text>}
                        value={userData.stats.orders}
                        prefix={<ShoppingOutlined style={{ color: colors.primary }} />}
                        valueStyle={{ 
                          color: colors.dark, 
                          fontSize: 28,
                          fontWeight: 600
                        }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Card 
                      bordered={false} 
                      style={{ 
                        background: `linear-gradient(135deg, ${colors.light} 0%, #ffffff 100%)`,
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Statistic
                        title={<Text style={{ color: colors.text }}>Estado de cuenta</Text>}
                        value={verificationStatus ? 'Verificada' : 'No verificada'}
                        prefix={verificationStatus ? 
                          <CheckCircleOutlined style={{ color: colors.success }} /> : 
                          <LoadingOutlined style={{ color: colors.warning }} />}
                        valueStyle={{ 
                          color: verificationStatus ? colors.success : colors.warning,
                          fontSize: 22,
                          fontWeight: 600
                        }}
                      />
                    </Card>
                  </Col>
                </Row>
                
                <Space>
                  <Button 
                    type={editMode ? 'default' : 'primary'} 
                    icon={<EditOutlined />}
                    onClick={() => setEditMode(!editMode)}
                    shape="round"
                    size="large"
                    style={{
                      background: editMode ? 'white' : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                      color: editMode ? colors.dark : 'white',
                      border: editMode ? `1px solid ${colors.primary}` : 'none',
                      fontWeight: 500
                    }}
                  >
                    {editMode ? 'Cancelar' : 'Editar Perfil'}
                  </Button>
                  
                  {editMode && (
                    <Button 
                      type="primary" 
                      onClick={handleSave}
                      shape="round"
                      size="large"
                      style={{
                        background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.successLight} 100%)`,
                        border: 'none',
                        fontWeight: 500
                      }}
                    >
                      Guardar Cambios
                    </Button>
                  )}
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
        
        {/* Pestañas de contenido */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarStyle={{ 
            margin: 0,
            padding: '0 24px',
            background: 'white'
          }}
          tabBarGutter={24}
        >
          <TabPane
            tab={
              <span style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '12px 0',
                fontWeight: 500
              }}>
                <div style={{
                  ...iconContainerStyle,
                  background: activeTab === 'info' ? colors.primary : 'rgba(67, 97, 238, 0.1)',
                }}>
                  <UserOutlined style={{
                    ...iconStyle,
                    color: activeTab === 'info' ? 'white' : colors.primary
                  }} />
                </div>
                <span style={{ 
                  marginLeft: 8,
                  color: activeTab === 'info' ? colors.primary : colors.text
                }}>
                  Información
                </span>
              </span>
            }
            key="info"
          >
            <div style={{ padding: 24 }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={iconContainerStyle}>
                          <IdcardOutlined style={iconStyle} />
                        </div>
                        <Text strong style={{ color: colors.dark, fontSize: 18 }}>
                          Datos Personales
                        </Text>
                      </div>
                    }
                    bordered={false}
                    style={{ 
                      ...cardStyle,
                      borderLeft: `3px solid ${colors.secondary}`
                    }}
                  >
                    <Descriptions column={1}>
                      <Descriptions.Item label={<Text strong style={{ color: colors.dark }}>Nombres</Text>}>
                        <Text style={{ color: colors.text }}>{userData.personalInfo.firstName}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={<Text strong style={{ color: colors.dark }}>Apellidos</Text>}>
                        <Text style={{ color: colors.text }}>
                          {userData.personalInfo.lastName} {userData.personalInfo.secondLastName}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={<Text strong style={{ color: colors.dark }}>DNI</Text>}>
                        <Text style={{ color: colors.text }}>{userData.personalInfo.dni}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={<Text strong style={{ color: colors.dark }}>Licencia</Text>}>
                        <Text style={{ color: colors.text }}>{userData.personalInfo.license}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={<Text strong style={{ color: colors.dark }}>Fecha de Nacimiento</Text>}>
                        <Text style={{ color: colors.text }}>
                          {dayjs(userData.personalInfo.birthDate).format('DD/MM/YYYY')}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={<Text strong style={{ color: colors.dark }}>Dirección</Text>}>
                        <Text style={{ color: colors.text }}>{userData.personalInfo.address}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={<Text strong style={{ color: colors.dark }}>Sexo</Text>}>
                        <Text style={{ color: colors.text }}>
                          {userData.personalInfo.gender === 'male' ? (
                            <span>
                              <ManOutlined style={{ 
                                marginRight: 8,
                                color: colors.primary
                              }} /> 
                              Masculino
                            </span>
                          ) : (
                            <span>
                              <WomanOutlined style={{ 
                                marginRight: 8,
                                color: '#ff4d6d'
                              }} /> 
                              Femenino
                            </span>
                          )}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label={<Text strong style={{ color: colors.dark }}>Tipo de Sangre</Text>}>
                        <Tag color="red" style={{ color: 'white' }}>
                          {userData.personalInfo.bloodType}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={iconContainerStyle}>
                          <MailOutlined style={iconStyle} />
                        </div>
                        <Text strong style={{ color: colors.dark, fontSize: 18 }}>
                          Datos de Usuario
                        </Text>
                      </div>
                    }
                    bordered={false}
                    style={{ 
                      ...cardStyle,
                      borderLeft: `3px solid ${colors.primary}`
                    }}
                  >
                    <Form form={form} initialValues={{
                      username: userData.username,
                      email: userData.email,
                      phone: userData.phone
                    }}>
                      <Form.Item 
                        label={<Text strong style={{ color: colors.dark }}>Nombre de usuario</Text>} 
                        name="username"
                        rules={[
                          { required: true, message: 'Ingrese su nombre de usuario' },
                          { pattern: /^@/, message: 'Debe comenzar con @' }
                        ]}
                      >
                        {editMode ? (
                          <Input 
                            prefix={<UserOutlined style={{ color: colors.text }} />} 
                            placeholder="@usuario"
                            style={{ borderRadius: 6 }}
                          />
                        ) : (
                          <Text style={{ color: colors.text }}>
                            <UserOutlined style={{ 
                              marginRight: 8, 
                              color: colors.primary
                            }} />
                            {userData.username}
                          </Text>
                        )}
                      </Form.Item>
                      
                      <Form.Item 
                        label={<Text strong style={{ color: colors.dark }}>Correo electrónico</Text>} 
                        name="email"
                        rules={[
                          { required: true, message: 'Ingrese su correo' },
                          { type: 'email', message: 'Correo no válido' }
                        ]}
                      >
                        {editMode ? (
                          <Input 
                            prefix={<MailOutlined style={{ color: colors.text }} />} 
                            style={{ borderRadius: 6 }}
                          />
                        ) : (
                          <Text style={{ color: colors.text }}>
                            <MailOutlined style={{ 
                              marginRight: 8, 
                              color: colors.primary
                            }} />
                            {userData.email}
                          </Text>
                        )}
                      </Form.Item>
                      
                      <Form.Item 
                        label={<Text strong style={{ color: colors.dark }}>Teléfono</Text>} 
                        name="phone"
                        rules={[
                          { required: true, message: 'Ingrese su teléfono' }
                        ]}
                      >
                        {editMode ? (
                          <Input 
                            prefix={<PhoneOutlined style={{ color: colors.text }} />} 
                            style={{ borderRadius: 6 }}
                          />
                        ) : (
                          <Text style={{ color: colors.text }}>
                            <PhoneOutlined style={{ 
                              marginRight: 8, 
                              color: colors.primary
                            }} />
                            {userData.phone}
                          </Text>
                        )}
                      </Form.Item>
                    </Form>
                  </Card>
                  
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={iconContainerStyle}>
                          <CarOutlined style={iconStyle} />
                        </div>
                        <Text strong style={{ color: colors.dark, fontSize: 18 }}>
                          Mis Motos
                        </Text>
                      </div>
                    }
                    bordered={false}
                    style={{ 
                      ...cardStyle,
                      borderLeft: `3px solid ${colors.secondary}`
                    }}
                    extra={
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddBikeModalVisible(true)}
                        size="small"
                        style={{
                          background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 500
                        }}
                      >
                        Añadir Moto
                      </Button>
                    }
                  >
                    {bikes.length > 0 ? (
                      <Row gutter={[16, 16]}>
                        {bikes.map(bike => (
                          <Col xs={24} key={bike.id}>
                            <Card
                              hoverable
                              cover={
                                <div style={{ 
                                  height: 140, 
                                  background: `url(${bike.image}) center/cover`,
                                  borderTopLeftRadius: 8,
                                  borderTopRightRadius: 8
                                }} />
                              }
                              style={{ 
                                borderRadius: 8,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                              }}
                              actions={[
                                <Button 
                                  type="text" 
                                  danger 
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteBike(bike.id)}
                                  style={{ 
                                    color: colors.error,
                                    fontWeight: 500
                                  }}
                                >
                                  Eliminar
                                </Button>
                              ]}
                            >
                              <Descriptions column={1}>
                                <Descriptions.Item label={<Text strong>Marca</Text>}>
                                  <Tag color={colors.primary} style={{ color: 'white' }}>
                                    {bike.brand}
                                  </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>Modelo</Text>}>
                                  <Text style={{ color: colors.text }}>{bike.model}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>Año</Text>}>
                                  <Text style={{ color: colors.text }}>{bike.year}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={<Text strong>Placa</Text>}>
                                  <Text style={{ color: colors.text }}>{bike.plate}</Text>
                                </Descriptions.Item>
                              </Descriptions>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '40px 0',
                        borderRadius: 8,
                        background: colors.light
                      }}>
                        <CarOutlined style={{ 
                          fontSize: 48, 
                          color: colors.text,
                          marginBottom: 16
                        }} />
                        <Title level={4} style={{ marginBottom: 8, color: colors.text }}>
                          No tienes motos registradas
                        </Title>
                        <Text style={{ color: colors.text }}>
                          Añade tu primera moto para comenzar
                        </Text>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '12px 0',
                fontWeight: 500
              }}>
                <div style={{
                  ...iconContainerStyle,
                  background: activeTab === 'history' ? colors.primary : 'rgba(67, 97, 238, 0.1)',
                }}>
                  <HistoryOutlined style={{
                    ...iconStyle,
                    color: activeTab === 'history' ? 'white' : colors.primary
                  }} />
                </div>
                <span style={{ 
                  marginLeft: 8,
                  color: activeTab === 'history' ? colors.primary : colors.text
                }}>
                  Historial
                </span>
              </span>
            }
            key="history"
          >
            <div style={{ padding: 24 }}>
              <Card 
                bordered={false} 
                style={{ 
                  ...cardStyle,
                  borderLeft: `3px solid ${colors.primary}`
                }}
              >
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 0',
                  background: `linear-gradient(135deg, ${colors.light} 0%, white 100%)`,
                  borderRadius: 12
                }}>
                  <ShoppingOutlined style={{ 
                    fontSize: 64, 
                    color: colors.primary,
                    marginBottom: 24
                  }} />
                  <Title level={3} style={{ marginBottom: 16, color: colors.dark }}>
                    Historial de Pedidos
                  </Title>
                  <Text style={{ 
                    color: colors.text,
                    maxWidth: 500,
                    margin: '0 auto',
                    fontSize: 16,
                    lineHeight: 1.6
                  }}>
                    Aquí podrás ver todos tus pedidos de repuestos, accesorios y servicios para tus motos.
                    Actualmente tienes {userData.stats.orders} pedidos realizados.
                  </Text>
                  
                  <Button 
                    type="primary" 
                    size="large" 
                    style={{ 
                      marginTop: 24,
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 500,
                      height: 48,
                      padding: '0 32px'
                    }}
                  >
                    Ver todos mis pedidos
                  </Button>
                </div>
              </Card>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '12px 0',
                fontWeight: 500
              }}>
                <div style={{
                  ...iconContainerStyle,
                  background: activeTab === 'security' ? colors.primary : 'rgba(67, 97, 238, 0.1)',
                }}>
                  <VerifiedOutlined style={{
                    ...iconStyle,
                    color: activeTab === 'security' ? 'white' : colors.primary
                  }} />
                </div>
                <span style={{ 
                  marginLeft: 8,
                  color: activeTab === 'security' ? colors.primary : colors.text
                }}>
                  Seguridad
                </span>
              </span>
            }
            key="security"
          >
            <div style={{ padding: 24 }}>
              <Card 
                bordered={false} 
                style={{ 
                  ...cardStyle,
                  borderLeft: `3px solid ${colors.primary}`
                }}
              >
                <List itemLayout="horizontal">
                  <List.Item
                    actions={[
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={handleChangePassword}
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                          border: 'none',
                          borderRadius: 6,
                          fontWeight: 500
                        }}
                      >
                        Cambiar
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={iconContainerStyle}>
                          <KeyOutlined style={iconStyle} />
                        </div>
                      }
                      title={<Text strong style={{ color: colors.dark }}>Contraseña</Text>}
                      description={<Text style={{ color: colors.text }}>Última actualización hace 3 meses</Text>}
                    />
                  </List.Item>
                  
                  <List.Item
                    actions={[
                      <Switch 
                        checked={twoFactorAuth} 
                        onChange={checked => {
                          setTwoFactorAuth(checked);
                          message.success(
                            checked ? 
                            'Autenticación en dos pasos activada' : 
                            'Autenticación en dos pasos desactivada'
                          );
                        }}
                        style={{
                          background: twoFactorAuth ? colors.success : '#ccc'
                        }}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={iconContainerStyle}>
                          <VerifiedOutlined style={iconStyle} />
                        </div>
                      }
                      title={<Text strong style={{ color: colors.dark }}>Autenticación en dos pasos</Text>}
                      description={<Text style={{ color: colors.text }}>Protege tu cuenta con verificación adicional</Text>}
                    />
                  </List.Item>

                  <List.Item
                    actions={[
                      verificationStatus ? (
                        <Tag 
                          icon={<VerifiedOutlined />} 
                          color={colors.success}
                          style={{ 
                            borderRadius: 20,
                            padding: '4px 12px',
                            fontWeight: 500
                          }}
                        >
                          Verificado
                        </Tag>
                      ) : (
                        <Button 
                          type="primary" 
                          size="small"
                          onClick={handleVerifyAccount}
                          style={{
                            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 500
                          }}
                        >
                          Verificar
                        </Button>
                      )
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={iconContainerStyle}>
                          <IdcardOutlined style={iconStyle} />
                        </div>
                      }
                      title={<Text strong style={{ color: colors.dark }}>Verificación de cuenta</Text>}
                      description={<Text style={{ color: colors.text }}>Verifica tu identidad para mayor seguridad</Text>}
                    />
                  </List.Item>
                </List>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal para añadir nueva moto */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={iconContainerStyle}>
              <PlusOutlined style={iconStyle} />
            </div>
            <Text strong style={{ fontSize: 18 }}>
              Añadir Nueva Moto
            </Text>
          </div>
        }
        visible={isAddBikeModalVisible}
        onOk={handleAddBike}
        onCancel={() => setIsAddBikeModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
        okButtonProps={{
          style: {
            background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%)`,
            border: 'none',
            borderRadius: 6,
            fontWeight: 500
          }
        }}
        cancelButtonProps={{
          style: {
            borderRadius: 6,
            fontWeight: 500
          }
        }}
        width={600}
      >
        <Form form={newBikeForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="brand"
                label={<Text strong>Marca</Text>}
                rules={[{ required: true, message: 'Ingrese la marca' }]}
              >
                <Input placeholder="Ej. Yamaha, Honda, Kawasaki" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="model"
                label={<Text strong>Modelo</Text>}
                rules={[{ required: true, message: 'Ingrese el modelo' }]}
              >
                <Input placeholder="Ej. YZF-R6, CBR600RR" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="year"
                label={<Text strong>Año</Text>}
                rules={[{ required: true, message: 'Ingrese el año' }]}
              >
                <InputNumber 
                  style={{ width: '100%', borderRadius: 6 }} 
                  placeholder="Ej. 2019" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="plate"
                label={<Text strong>Placa</Text>}
                rules={[{ required: true, message: 'Ingrese la placa' }]}
              >
                <Input placeholder="Ej. ABC-1234" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="image"
            label={<Text strong>Imagen de la moto (Opcional)</Text>}
          >
            <Upload.Dragger 
              accept="image/*"
              beforeUpload={beforeUpload}
              showUploadList={false}
              style={{ borderRadius: 6 }}
            >
              <div style={{ padding: '20px 0' }}>
                <CameraOutlined style={{ fontSize: 32, color: colors.text }} />
                <Text style={{ display: 'block', color: colors.text }}>
                  Haz clic o arrastra una imagen
                </Text>
              </div>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para verificación de cuenta */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={iconContainerStyle}>
              <VerifiedOutlined style={iconStyle} />
            </div>
            <Text strong style={{ fontSize: 18 }}>
              Verificar Cuenta
            </Text>
          </div>
        }
        visible={verificationModalVisible}
        onOk={handleVerificationSubmit}
        onCancel={() => {
          setVerificationModalVisible(false);
          setPasswordSteps(0);
        }}
        okText={passwordSteps === 1 ? 'Verificando...' : 'Verificar'}
        cancelText="Cancelar"
        okButtonProps={{
          disabled: passwordSteps === 1,
          style: {
            background: passwordSteps === 1 ? '#ccc' : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
            border: 'none',
            borderRadius: 6,
            fontWeight: 500
          }
        }}
        cancelButtonProps={{
          disabled: passwordSteps === 1,
          style: {
            borderRadius: 6,
            fontWeight: 500
          }
        }}
        closable={passwordSteps !== 1}
        width={600}
      >
        <Steps current={passwordSteps} style={{ marginBottom: 32 }}>
          <Step title="Ingresar código" />
          <Step title="Verificando" />
          <Step title="Completado" />
        </Steps>

        {passwordSteps === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              background: `${colors.primary}20`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IdcardOutlined style={{ fontSize: 36, color: colors.primary }} />
            </div>
            
            <Title level={4} style={{ marginBottom: 24 }}>Verificación de Identidad</Title>
            
            <Radio.Group 
              value={verificationMethod} 
              onChange={(e) => setVerificationMethod(e.target.value)}
              style={{ marginBottom: 24, width: '100%' }}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="email" style={{ width: '50%' }}>
                <MailOutlined style={{ marginRight: 8 }} /> Correo
              </Radio.Button>
              <Radio.Button value="whatsapp" style={{ width: '50%' }}>
                WhatsApp
              </Radio.Button>
            </Radio.Group>
            
            <Text style={{ marginBottom: 24, display: 'block', color: colors.text }}>
              Hemos enviado un código de verificación a tu {verificationMethod === 'email' ? 'correo electrónico' : 'WhatsApp'}. 
              Por favor ingrésalo a continuación.
            </Text>
            
            <Input 
              placeholder="Código de verificación" 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={{ 
                textAlign: 'center', 
                fontSize: 18,
                height: 48,
                borderRadius: 8,
                marginBottom: 16
              }}
              maxLength={6}
            />
            
            <Text style={{ marginTop: 16, display: 'block', color: colors.text }}>
              ¿No recibiste el código? <Button 
                type="link" 
                size="small" 
                onClick={sendVerificationCode}
                style={{ fontWeight: 500 }}
              >
                Reenviar código
              </Button>
            </Text>
          </div>
        )}

        {passwordSteps === 1 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              background: `${colors.primary}20`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LoadingOutlined style={{ fontSize: 36, color: colors.primary }} />
            </div>
            <Title level={4} style={{ marginTop: 16 }}>Verificando código...</Title>
            <Text style={{ color: colors.text }}>
              Esto puede tomar unos segundos
            </Text>
          </div>
        )}

        {passwordSteps === 2 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              background: `${colors.success}20`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircleOutlined style={{ fontSize: 36, color: colors.success }} />
            </div>
            <Title level={4} style={{ marginTop: 16 }}>¡Cuenta verificada!</Title>
            <Text style={{ color: colors.text }}>
              Tu cuenta ha sido verificada exitosamente.
            </Text>
          </div>
        )}
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={iconContainerStyle}>
              <KeyOutlined style={iconStyle} />
            </div>
            <Text strong style={{ fontSize: 18 }}>
              Cambiar Contraseña
            </Text>
          </div>
        }
        visible={changePasswordModalVisible}
        onOk={handlePasswordSubmit}
        onCancel={() => {
          setChangePasswordModalVisible(false);
          setPasswordSteps(0);
        }}
        okText={passwordSteps === 1 ? 'Procesando...' : 'Cambiar Contraseña'}
        cancelText="Cancelar"
        okButtonProps={{
          disabled: passwordSteps === 1,
          style: {
            background: passwordSteps === 1 ? '#ccc' : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
            border: 'none',
            borderRadius: 6,
            fontWeight: 500
          }
        }}
        cancelButtonProps={{
          disabled: passwordSteps === 1,
          style: {
            borderRadius: 6,
            fontWeight: 500
          }
        }}
        closable={passwordSteps !== 1}
        width={600}
      >
        <Steps current={passwordSteps} style={{ marginBottom: 32 }}>
          <Step title="Verificación" />
          <Step title="Nueva contraseña" />
          <Step title="Completado" />
        </Steps>

        {passwordSteps === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              background: `${colors.primary}20`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SafetyCertificateFilled style={{ fontSize: 36, color: colors.primary }} />
            </div>
            
            <Title level={4} style={{ marginBottom: 24 }}>Verificación Requerida</Title>
            
            <Alert 
              message="Para cambiar tu contraseña necesitamos verificar tu identidad"
              type="info"
              showIcon
              style={{ 
                marginBottom: 24,
                borderRadius: 8,
                textAlign: 'left'
              }}
            />
            
            <Radio.Group 
              value={verificationMethod} 
              onChange={(e) => setVerificationMethod(e.target.value)}
              style={{ marginBottom: 16, width: '100%' }}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="email" style={{ width: '50%' }}>
                <MailOutlined style={{ marginRight: 8 }} /> Correo
              </Radio.Button>
              <Radio.Button value="whatsapp" style={{ width: '50%' }}>
                WhatsApp
              </Radio.Button>
            </Radio.Group>
            
            <Button 
              type="primary" 
              onClick={sendVerificationCode}
              style={{ 
                width: '100%', 
                height: 48,
                borderRadius: 8,
                fontWeight: 500,
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary} 100%)`,
                border: 'none',
                marginBottom: 16
              }}
            >
              Enviar código de verificación
            </Button>
          </div>
        )}

        {passwordSteps === 1 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              background: `${colors.primary}20`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LoadingOutlined style={{ fontSize: 36, color: colors.primary }} />
            </div>
            <Title level={4} style={{ marginTop: 16 }}>Procesando cambio...</Title>
            <Text style={{ color: colors.text }}>
              Estamos actualizando tu contraseña de forma segura
            </Text>
          </div>
        )}

        {passwordSteps === 2 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              background: `${colors.success}20`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircleOutlined style={{ fontSize: 36, color: colors.success }} />
            </div>
            <Title level={4} style={{ marginTop: 16 }}>¡Contraseña cambiada!</Title>
            <Text style={{ color: colors.text }}>
              Tu contraseña ha sido actualizada exitosamente.
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MotoUserProfile;