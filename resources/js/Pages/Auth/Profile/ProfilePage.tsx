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
  WomanOutlined, StarFilled, TrophyFilled, 
  SafetyCertificateFilled, SettingFilled, ShoppingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

// Paleta de colores
const colors = {
  primary: '#4361ee',
  primaryLight: '#5a75f1',
  secondary: '#3a0ca3',
  accent: '#4cc9f0',
  accentDark: '#3a86c8', // Add a darker shade for accent
  success: '#2ecc71',
  successLight: '#58d68d', // Add a lighter shade for success
  warning: '#f39c12',
  error: '#e74c3c',
  dark: '#2c3e50',
  light: '#f8f9fa',
  whatsapp: '#25D366',
  instagram: '#E1306C',
  text: '#34495e'
};

// Estilos reutilizables
const cardStyle = {
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  border: 'none',
  overflow: 'hidden'
};

const iconStyle = {
  background: 'white',
  padding: 12,
  borderRadius: '50%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  color: colors.primary,
  fontSize: 20
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
  specialities: string[];
  stats: {
    orders: number;
    rides: number;
    rating: number;
  };
  social: {
    whatsapp: string;
    instagram: string;
    facebook: string;
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
  achievements: {
    name: string;
    icon: React.ReactNode;
    earned: boolean;
  }[];
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
    location: 'Lima, Perú',
    joinDate: 'Miembro desde Enero 2015',
    specialities: ['Viajes largos', 'Motocross', 'Custom bikes', 'Mecánica básica'],
    stats: {
      orders: 142,
      rides: 56,
      rating: 4.8
    },
    social: {
      whatsapp: '51987654321',
      instagram: 'carlosmoto_aventuras',
      facebook: 'carlos.motero.aventuras'
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
    },
    achievements: [
      { name: 'Viajero experimentado', icon: <TrophyFilled />, earned: true },
      { name: 'Primeros auxilios', icon: <SafetyCertificateFilled />, earned: true },
      { name: 'Mecánica básica', icon: <SettingFilled />, earned: true }
    ]
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

  const SocialIcon = ({ type }: { type: 'whatsapp' | 'instagram' | 'facebook' }) => {
    const iconStyle = {
      width: 20,
      height: 20,
      marginRight: 8,
      verticalAlign: 'text-bottom'
    };
    
    if (type === 'whatsapp') {
      return (
        <svg viewBox="0 0 32 32" style={iconStyle}>
          <path fill={colors.whatsapp} d="M17.472 14.382v-.002c-.607-.302-1.224-.617-1.85-.775-.52-.133-.902-.07-1.242.49-.213.283-.816.99-.998 1.186-.213.236-.426.267-.792.09-.366-.178-1.545-.567-2.945-1.804-1.088-1.002-1.822-2.24-2.037-2.618-.213-.38-.024-.586.16-.774.16-.16.366-.426.55-.64.18-.213.24-.366.366-.61.122-.236.06-.446-.03-.624-.09-.178-.792-1.896-1.085-2.6-.285-.71-.576-.614-.792-.624-.213-.008-.457-.01-.7-.01-.244 0-.64.09-.975.426-.335.337-1.28 1.246-1.28 3.042 0 1.796 1.312 3.53 1.495 3.774.183.244 2.575 3.97 6.245 5.528 3.67 1.558 3.67 1.04 4.33.978.66-.062 2.13-.867 2.43-1.71.3-.843.3-1.566.21-1.71-.09-.144-.334-.232-.7-.426zm-5.73 10.403c-.405.115-.82.195-1.24.24-1.25.13-2.8-.012-4.493-.78-3.063-1.367-5.533-4.43-6.21-7.893C-.5 11.75 2.462 6.12 7.534 3.8c1.33-.61 2.76-.96 4.24-1.03.21-.01.415-.016.62-.016.9 0 1.8.13 2.67.39.24.07.46.22.61.43.16.21.22.47.18.72l-.39 2.47c-.04.25-.18.48-.38.62-.21.15-.46.2-.71.15-1.13-.32-2.3-.5-3.49-.5-3.05 0-5.91 1.6-7.49 4.27-1.58 2.67-1.58 5.85 0 8.52 1.58 2.67 4.44 4.27 7.49 4.27.81 0 1.62-.12 2.4-.35.25-.07.52-.03.74.12.22.15.36.4.39.66l.28 1.84c.03.25-.03.5-.17.7-.14.2-.36.33-.6.36z"/>
        </svg>
      );
    } else if (type === 'instagram') {
      return (
        <svg viewBox="0 0 24 24" style={iconStyle}>
          <path fill={colors.instagram} d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 24 24" style={iconStyle}>
          <path fill="#3b5998" d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
        </svg>
      );
    }
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
                <Tag icon={<TrophyFilled style={{ color: colors.primary }} />} color="#fff">
                  Nivel 3
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
                        title={<Text style={{ color: colors.text }}>Viajes realizados</Text>}
                        value={userData.stats.rides}
                        prefix={<CarOutlined style={{ color: colors.primary }} />}
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
                  ...iconStyle,
                  background: activeTab === 'info' ? colors.primary : 'white',
                  color: activeTab === 'info' ? 'white' : colors.primary
                }}>
                  <UserOutlined />
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
                        <IdcardOutlined style={{ 
                          color: colors.secondary,
                          fontSize: 20,
                          marginRight: 12
                        }} />
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
                                color: colors.primary, 
                                marginRight: 8,
                                background: `${colors.primary}20`,
                                padding: 4,
                                borderRadius: '50%'
                              }} /> 
                              Masculino
                            </span>
                          ) : (
                            <span>
                              <WomanOutlined style={{ 
                                color: colors.instagram, 
                                marginRight: 8,
                                background: `${colors.instagram}20`,
                                padding: 4,
                                borderRadius: '50%'
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
                  
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TrophyFilled style={{ 
                          color: colors.warning,
                          fontSize: 20,
                          marginRight: 12
                        }} />
                        <Text strong style={{ color: colors.dark, fontSize: 18 }}>
                          Mis Logros
                        </Text>
                      </div>
                    }
                    bordered={false}
                    style={{ 
                      ...cardStyle,
                      borderLeft: `3px solid ${colors.warning}`
                    }}
                  >
                    <List
                      dataSource={userData.achievements}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <div style={{
                                ...iconStyle,
                                background: item.earned ? `${colors.success}20` : '#f0f0f0',
                                color: item.earned ? colors.success : colors.text
                              }}>
                                {item.icon}
                              </div>
                            }
                            title={<Text strong style={{ color: colors.dark }}>{item.name}</Text>}
                            description={
                              item.earned ? (
                                <Tag icon={<CheckOutlined />} color={colors.success} style={{ borderRadius: 10 }}>
                                  Completado
                                </Tag>
                              ) : (
                                <Tag color="default" style={{ borderRadius: 10 }}>
                                  Pendiente
                                </Tag>
                              )
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SettingFilled style={{ 
                          color: colors.primary,
                          fontSize: 20,
                          marginRight: 12
                        }} />
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
                              color: colors.primary,
                              background: `${colors.primary}20`,
                              padding: 4,
                              borderRadius: '50%'
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
                              color: colors.primary,
                              background: `${colors.primary}20`,
                              padding: 4,
                              borderRadius: '50%'
                            }} />
                            {userData.email}
                          </Text>
                        )}
                      </Form.Item>
                      
                      <Form.Item 
                        label={<Text strong style={{ color: colors.dark }}>Teléfono/WhatsApp</Text>} 
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
                              color: colors.primary,
                              background: `${colors.primary}20`,
                              padding: 4,
                              borderRadius: '50%'
                            }} />
                            {userData.phone} 
                            <Button 
                              type="text" 
                              size="small" 
                              style={{ 
                                color: colors.whatsapp, 
                                marginLeft: 8,
                                fontWeight: 500,
                                background: `${colors.whatsapp}10`,
                                borderRadius: 6
                              }}
                            >
                              <SocialIcon type="whatsapp" />
                              Chat
                            </Button>
                          </Text>
                        )}
                      </Form.Item>
                    </Form>
                    
                    <Divider style={{ borderColor: '#e8e8e8' }} />
                    
                    <Title level={5} style={{ color: colors.dark, marginBottom: 16 }}>
                      Redes Sociales
                    </Title>
                    
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button 
                        type="text" 
                        block 
                        style={{ 
                          textAlign: 'left',
                          color: colors.whatsapp,
                          background: `${colors.whatsapp}10`,
                          borderRadius: 8,
                          height: 40
                        }}
                      >
                        <SocialIcon type="whatsapp" />
                        {userData.social.whatsapp}
                      </Button>
                      
                      <Button 
                        type="text" 
                        block 
                        style={{ 
                          textAlign: 'left',
                          color: colors.instagram,
                          background: `${colors.instagram}10`,
                          borderRadius: 8,
                          height: 40
                        }}
                      >
                        <SocialIcon type="instagram" />
                        @{userData.social.instagram}
                      </Button>
                      
                      <Button 
                        type="text" 
                        block 
                        style={{ 
                          textAlign: 'left',
                          color: '#3b5998',
                          background: '#3b599810',
                          borderRadius: 8,
                          height: 40
                        }}
                      >
                        <SocialIcon type="facebook" />
                        {userData.social.facebook}
                      </Button>
                    </Space>
                  </Card>
                  
                  <Card 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CarOutlined style={{ 
                          color: colors.secondary,
                          fontSize: 20,
                          marginRight: 12
                        }} />
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
                          background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
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
                  ...iconStyle,
                  background: activeTab === 'history' ? colors.primary : 'white',
                  color: activeTab === 'history' ? 'white' : colors.primary
                }}>
                  <HistoryOutlined />
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
                  ...iconStyle,
                  background: activeTab === 'security' ? colors.primary : 'white',
                  color: activeTab === 'security' ? 'white' : colors.primary
                }}>
                  <SafetyCertificateFilled />
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
                        <div style={{
                          ...iconStyle,
                          background: `${colors.primary}20`
                        }}>
                          <KeyOutlined />
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
                        <div style={{
                          ...iconStyle,
                          background: `${colors.primary}20`
                        }}>
                          <SafetyCertificateFilled />
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
                            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
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
                        <div style={{
                          ...iconStyle,
                          background: `${colors.primary}20`
                        }}>
                          <IdcardOutlined />
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
            <PlusOutlined style={{ 
              color: colors.accent,
              fontSize: 20,
              marginRight: 12
            }} />
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
            background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.successLight} 100%)`,
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
            <VerifiedOutlined style={{ 
              color: colors.primary,
              fontSize: 20,
              marginRight: 12
            }} />
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
                <SocialIcon type="whatsapp" /> WhatsApp
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
            <KeyOutlined style={{ 
              color: colors.primary,
              fontSize: 20,
              marginRight: 12
            }} />
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
                <SocialIcon type="whatsapp" /> WhatsApp
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
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
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