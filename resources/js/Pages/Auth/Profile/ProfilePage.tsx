import React, { useState } from 'react';
import { 
  Card, Typography, Divider, Space, Button, Avatar, 
  Tag, Row, Col, List, Input, Form, Badge, Tabs, 
  Progress, Popover, Upload, message, Descriptions, Statistic, UploadFile, 
} from 'antd';
import { 
  UserOutlined, MailOutlined, PhoneOutlined, EditOutlined,
  EnvironmentOutlined, LockOutlined, SafetyOutlined, 
  ShoppingOutlined, ToolOutlined, CarOutlined,
  CameraOutlined, CheckOutlined, StarOutlined,
  CalendarOutlined, TrophyOutlined, HistoryOutlined
} from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const MotoUserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('info');
  const [avatar, setAvatar] = useState('https://randomuser.me/api/portraits/men/45.jpg');
  const primaryColor = '#1890ff'; // Azul principal
  const lightBlue = '#e6f7ff'; // Azul claro para fondos

  // Datos del usuario especializado en motos
  const userData = {
    name: 'Carlos Mecánico',
    username: '@carlosmoto',
    role: 'Mecánico Especialista',
    bio: 'Especialista en motos deportivas con 10+ años de experiencia. Venta de repuestos originales y personalizados.',
    email: 'carlos@motorepuestos.com',
    phone: '+51 987 654 321',
    location: 'Taller: Av. Motores 123, Lima',
    joinDate: 'Miembro desde 2015',
    specialities: ['Motores 4T', 'Suspensiones', 'Frenos', 'Transmisión'],
    stats: {
      orders: 142,
      completed: 138,
      rating: 4.9,
      bikesRepaired: '500+'
    },
    bikeInfo: {
      brand: 'Yamaha',
      model: 'YZF-R6',
      year: 2019,
      modifications: ['Escape Akrapovic', 'Suspensión Öhlins', 'Frenos Brembo']
    },
    social: {
      whatsapp: '51987654321',
      instagram: 'carlosmoto_repuestos'
    }
  };

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        message.success('Perfil actualizado correctamente');
        setEditMode(false);
      })
      .catch(err => message.error('Complete los campos requeridos'));
  };

  const beforeUpload = (file: { type: string; size: number; }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) message.error('Solo imágenes JPG/PNG!');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error('Imagen debe ser <2MB!');
    return isJpgOrPng && isLt2M;
  };

  const handleAvatarChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file && info.file.status === 'done' && info.file.originFileObj) {
      setAvatar(URL.createObjectURL(info.file.originFileObj));
      message.success('Foto actualizada!');
    }
  };

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '24px',
      background: '#f5f5f5'
    }}>
      <Card
        bordered={false}
        style={{ 
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: `4px solid ${primaryColor}`
        }}
      >
        {/* Header con avatar y stats */}
        <Row gutter={24} align="middle" style={{ marginBottom: 24 }}>
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
                      backgroundColor: primaryColor,
                      color: 'white',
                      border: '2px solid white'
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
                  border: `4px solid ${primaryColor}`,
                  boxShadow: `0 4px 8px rgba(24, 144, 255, 0.3)`
                }}
              />
            </Badge>
            
            <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
              {userData.name}
            </Title>
            <Tag color={primaryColor} style={{ marginTop: 8 }}>
              <ToolOutlined /> {userData.role}
            </Tag>
            
            <div style={{ marginTop: 16 }}>
              <Button 
                type="primary" 
                style={{ marginRight: 8 }}
                icon={<ShoppingOutlined />}
              >
                Mis Pedidos
              </Button>
            </div>
          </Col>
          
          <Col xs={24} md={18}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                {editMode ? (
                  <Form.Item name="bio">
                    <TextArea 
                      rows={3} 
                      maxLength={200} 
                      style={{ fontSize: 16 }}
                    />
                  </Form.Item>
                ) : (
                  <Text style={{ fontSize: 16 }}>{userData.bio}</Text>
                )}
              </div>
              
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Card bordered={false} style={{ background: lightBlue }}>
                    <Statistic
                      title="Pedidos"
                      value={userData.stats.orders}
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ color: primaryColor }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card bordered={false} style={{ background: lightBlue }}>
                    <Statistic
                      title="Rating"
                      value={userData.stats.rating}
                      precision={1}
                      suffix="/5"
                      prefix={<StarOutlined />}
                      valueStyle={{ color: primaryColor }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card bordered={false} style={{ background: lightBlue }}>
                    <Statistic
                      title="Motos Reparadas"
                      value={userData.stats.bikesRepaired}
                      prefix={<CarOutlined />}
                      valueStyle={{ color: primaryColor }}
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
                >
                  {editMode ? 'Cancelar' : 'Editar Perfil'}
                </Button>
                
                {editMode && (
                  <Button 
                    type="primary" 
                    onClick={handleSave}
                    shape="round"
                    size="large"
                  >
                    Guardar Cambios
                  </Button>
                )}
              </Space>
            </Space>
          </Col>
        </Row>
        
        <Divider style={{ margin: '24px 0', borderColor: '#d9e6ff' }} />
        
        {/* Pestañas de contenido */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 24 }}
          tabBarGutter={24}
        >
          <TabPane
            tab={
              <span>
                <UserOutlined style={{ fontSize: 16 }} />
                <span style={{ marginLeft: 8 }}>Información</span>
              </span>
            }
            key="info"
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Card 
                  title="Datos Personales"
                  bordered={false}
                  style={{ marginBottom: 24, borderLeft: `3px solid ${primaryColor}` }}
                >
                  <Form form={form} initialValues={userData}>
                    <Form.Item label="Nombre de usuario" name="username">
                      {editMode ? (
                        <Input 
                          prefix="@"
                          suffix={
                            <Tag color="green" style={{ marginLeft: 8 }}>
                              Disponible
                            </Tag>
                          }
                        />
                      ) : (
                        <Text strong>@{userData.username}</Text>
                      )}
                    </Form.Item>
                    
                    <Form.Item label="Correo electrónico" name="email">
                      {editMode ? (
                        <Input prefix={<MailOutlined />} />
                      ) : (
                        <Text>
                          <MailOutlined style={{ marginRight: 8 }} />
                          {userData.email}
                        </Text>
                      )}
                    </Form.Item>
                    
                    <Form.Item label="Teléfono/WhatsApp" name="phone">
                      {editMode ? (
                        <Input prefix={<PhoneOutlined />} />
                      ) : (
                        <Text>
                          <PhoneOutlined style={{ marginRight: 8 }} />
                          {userData.phone} 
                          <Button 
                            type="text" 
                            size="small" 
                            style={{ color: '#25D366', marginLeft: 8 }}
                          >
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                              alt="WhatsApp" 
                              style={{ width: 16, height: 16, marginRight: 4 }} 
                            />
                            Chat
                          </Button>
                        </Text>
                      )}
                    </Form.Item>
                    
                    <Form.Item label="Ubicación/Taller" name="location">
                      {editMode ? (
                        <Input prefix={<EnvironmentOutlined />} />
                      ) : (
                        <Text>
                          <EnvironmentOutlined style={{ marginRight: 8 }} />
                          {userData.location}
                        </Text>
                      )}
                    </Form.Item>
                  </Form>
                </Card>
                
                <Card 
                  title="Especialidades"
                  bordered={false}
                  style={{ borderLeft: `3px solid ${primaryColor}` }}
                >
                  {userData.specialities.map(skill => (
                    <Tag 
                      key={skill} 
                      color="blue" 
                      style={{ 
                        marginBottom: 8, 
                        padding: '6px 12px',
                        fontSize: 14
                      }}
                    >
                      <ToolOutlined style={{ marginRight: 5 }} />
                      {skill}
                    </Tag>
                  ))}
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                <Card 
                  title="Mi Moto"
                  bordered={false}
                  style={{ marginBottom: 24, borderLeft: `3px solid ${primaryColor}` }}
                  extra={
                    <Button type="text" icon={<EditOutlined />}>
                      {editMode ? 'Guardar' : 'Editar'}
                    </Button>
                  }
                >
                  <Descriptions column={1}>
                    <Descriptions.Item label="Marca">
                      <Text strong>{userData.bikeInfo.brand}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Modelo">
                      <Text strong>{userData.bikeInfo.model}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Año">
                      <Text strong>{userData.bikeInfo.year}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Modificaciones">
                      <ul style={{ paddingLeft: 20, margin: 0 }}>
                        {userData.bikeInfo.modifications.map((mod, i) => (
                          <li key={i}>
                            <Text>{mod}</Text>
                          </li>
                        ))}
                      </ul>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
                
                <Card 
                  title="Contacto y Redes"
                  bordered={false}
                  style={{ borderLeft: `3px solid ${primaryColor}` }}
                >
                  <Space size="middle">
                    <Button 
                      type="text" 
                      icon={
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" 
                          alt="Instagram" 
                          style={{ width: 16, height: 16 }} 
                        />
                      }
                      style={{ color: '#E1306C' }}
                    >
                      @carlosmoto_repuestos
                    </Button>
                    
                    <Button 
                      type="text" 
                      icon={
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                          alt="WhatsApp" 
                          style={{ width: 16, height: 16 }} 
                        />
                      }
                      style={{ color: '#25D366' }}
                    >
                      Contactar
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <HistoryOutlined style={{ fontSize: 16 }} />
                <span style={{ marginLeft: 8 }}>Historial</span>
              </span>
            }
            key="history"
          >
            <Card bordered={false} style={{ borderLeft: `3px solid ${primaryColor}` }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0',
                background: lightBlue,
                borderRadius: 8
              }}>
                <ShoppingOutlined style={{ 
                  fontSize: 48, 
                  color: primaryColor,
                  marginBottom: 16
                }} />
                <Title level={4} style={{ marginBottom: 8 }}>
                  Historial de Pedidos
                </Title>
                <Text type="secondary">
                  Tus últimos pedidos de repuestos aparecerán aquí
                </Text>
              </div>
            </Card>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <SafetyOutlined style={{ fontSize: 16 }} />
                <span style={{ marginLeft: 8 }}>Seguridad</span>
              </span>
            }
            key="security"
          >
            <Card bordered={false} style={{ borderLeft: `3px solid ${primaryColor}` }}>
              <List itemLayout="horizontal">
                <List.Item
                  actions={[
                    <Button type="primary" size="small">
                      Cambiar
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<LockOutlined style={{ fontSize: 20, color: primaryColor }} />}
                    title="Contraseña"
                    description="Última actualización hace 3 meses"
                  />
                </List.Item>
                
                <List.Item
                  actions={[
                    <Button type="primary" size="small">
                      Activar
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<SafetyOutlined style={{ fontSize: 20, color: primaryColor }} />}
                    title="Verificación en dos pasos"
                    description="Protege tu cuenta de repuestos"
                  />
                </List.Item>
              </List>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default MotoUserProfile;