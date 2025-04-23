import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Divider, Space, Button, Avatar,
  Tag, Row, Col, List, Input, Form, Badge, Tabs,
  Upload, message, Descriptions, Statistic,
  Modal, InputNumber, Switch, Layout, DatePicker,
  notification
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, EditOutlined,
  CameraOutlined, PlusOutlined, DeleteOutlined, CloseOutlined,
  ManOutlined, WomanOutlined, StarFilled, ShoppingOutlined,
  LoadingOutlined, SaveOutlined, BulbOutlined, BulbFilled,
  BellOutlined, LockOutlined, KeyOutlined, EyeInvisibleOutlined, EyeTwoTone
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Header, Content } = Layout;

// Paleta de colores mejorada para modo oscuro
const colors = {
  primary: '#4361ee',
  primaryDark: '#3a0ca3',
  secondary: '#4cc9f0',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  dark: '#1a1a2e',
  darkSecondary: '#16213e',
  darkAccent: '#0f3460',
  light: '#f8f9fa',
  text: '#34495e',
  textLight: '#e6e6e6',
  textDark: '#b8b8b8',
  backgroundLight: '#f0f2f5',
  backgroundDark: '#121212'
};

// Estilos dinámicos basados en el modo
const getStyles = (darkMode: boolean) => ({
  card: {
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    border: 'none',
    backgroundColor: darkMode ? colors.darkSecondary : '#fff',
    color: darkMode ? colors.textLight : colors.text
  },
  headerCard: {
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    border: 'none',
    backgroundColor: darkMode ? colors.dark : colors.primary,
    color: darkMode ? colors.textLight : '#fff'
  },
  bikeCard: {
    marginBottom: 16,
    backgroundColor: darkMode ? colors.darkAccent : colors.light,
    color: darkMode ? colors.textLight : colors.text,
    border: darkMode ? '1px solid #333' : '1px solid #f0f0f0'
  },
  layout: {
    backgroundColor: darkMode ? colors.backgroundDark : colors.backgroundLight,
    minHeight: '100vh'
  },
  text: {
    color: darkMode ? colors.textLight : colors.text
  },
  textSecondary: {
    color: darkMode ? colors.textDark : colors.text
  },
  imageContainer: {
    height: 160,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
  }
});

interface Bike {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  image: string;
  imageFile?: File;
}

interface UserData {
  name: string;
  username: string;
  email: string;
  phone: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dni: string;
    license: string;
    gender: string;
  };
  stats: {
    orders: number;
    rating: number;
  };
}

interface Order {
  id: number;
  date: string;
  status: string;
  items: string[];
  image?: string;
  imageFile?: File;
}

const MotoUserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('info');
  const [avatar, setAvatar] = useState('https://randomuser.me/api/portraits/men/45.jpg');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [bikes, setBikes] = useState<Bike[]>([
    {
      id: 1,
      brand: 'Yamaha',
      model: 'YZF-R6',
      year: 2019,
      plate: 'ABC-1234',
      image: 'https://www.yamaha-motor.com.br/uploads/bikes/YZF-R6-AZUL-2020-MY22-1.png'
    }
  ]);
  const [isAddBikeModalVisible, setIsAddBikeModalVisible] = useState(false);
  const [newBikeForm] = Form.useForm();
  const [bikeImageLoading, setBikeImageLoading] = useState<Record<number, boolean>>({});
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const [darkMode, setDarkMode] = useState(false);
  const [isAddOrderModalVisible, setIsAddOrderModalVisible] = useState(false);
  const [newOrderForm] = Form.useForm();
  const [orderImageLoading, setOrderImageLoading] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    name: 'Carlos Motero',
    username: '@carlosmoto',
    email: 'carlos@motero.com',
    phone: '+51 916 184 836',
    personalInfo: {
      firstName: 'Carlos',
      lastName: 'Motero',
      dni: '12345678',
      license: 'A-12345678',
      gender: 'male'
    },
    stats: {
      orders: 142,
      rating: 4.8
    }
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      date: '2023-10-01',
      status: 'Completado',
      items: ['Repuesto 1', 'Repuesto 2'],
      image: 'https://via.placeholder.com/300x200?text=Pedido+1'
    },
    {
      id: 2,
      date: '2023-09-15',
      status: 'En Proceso',
      items: ['Repuesto 3'],
      image: 'https://via.placeholder.com/300x200?text=Pedido+2'
    }
  ]);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    document.body.style.backgroundColor = darkMode ? colors.backgroundDark : colors.backgroundLight;
  }, [darkMode]);

  const styles = getStyles(darkMode);

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        const updatedUser = {
          ...userData,
          username: values.username,
          email: values.email,
          phone: values.phone
        };

        setUserData(updatedUser);
        message.success('Perfil actualizado correctamente');
        setEditMode(false);
      })
      .catch(() => message.error('Complete los campos requeridos'));
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Solo imágenes JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Imagen debe ser <2MB!');
      return false;
    }
    return isJpgOrPng && isLt2M;
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setAvatar(imageUrl);
      setAvatarLoading(false);
      message.success('Foto de perfil actualizada!');
    }

    if (info.file.status === 'error') {
      setAvatarLoading(false);
      message.error('Error al subir la imagen');
    }
  };

  const handleBikeImageChange = (info: any, bikeId: number) => {
    if (info.file.status === 'uploading') {
      setBikeImageLoading(prev => ({ ...prev, [bikeId]: true }));
      return;
    }

    if (info.file.status === 'done') {
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setBikes(bikes.map(bike =>
        bike.id === bikeId ? { ...bike, image: imageUrl } : bike
      ));
      setBikeImageLoading(prev => ({ ...prev, [bikeId]: false }));
      message.success('Foto de moto actualizada!');
    }

    if (info.file.status === 'error') {
      setBikeImageLoading(prev => ({ ...prev, [bikeId]: false }));
      message.error('Error al subir la imagen');
    }
  };

  const handleAddBike = () => {
    newBikeForm.validateFields()
      .then(values => {
        const newBike: Bike = {
          ...values,
          id: Date.now(),
          image: values.imageFile ? URL.createObjectURL(values.imageFile) :
            `https://via.placeholder.com/300x200?text=${values.brand}+${values.model}`
        };

        setBikes([...bikes, newBike]);
        message.success('Moto añadida correctamente');
        setIsAddBikeModalVisible(false);
        newBikeForm.resetFields();
      });
  };

  const handleDeleteBike = (id: number) => {
    Modal.confirm({
      title: '¿Eliminar esta moto?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setBikes(bikes.filter(bike => bike.id !== id));
        message.success('Moto eliminada');
      }
    });
  };

  const handleChangePassword = () => {
    passwordForm.validateFields()
      .then(values => {
        if (values.newPassword !== values.confirmPassword) {
          message.error('Las contraseñas no coinciden');
          return;
        }
        message.success('Contraseña cambiada exitosamente');
        setIsChangePasswordModalVisible(false);
        passwordForm.resetFields();
      })
      .catch(() => message.error('Complete los campos requeridos'));
  };

  const handleAddOrder = () => {
    newOrderForm.validateFields()
      .then(values => {
        const newOrder: Order = {
          id: Date.now(),
          date: values.date.format('YYYY-MM-DD'),
          status: values.status,
          items: values.items.split(',').map((item: string) => item.trim()),
          image: values.imageFile ? URL.createObjectURL(values.imageFile) : undefined
        };

        setOrders([...orders, newOrder]);
        message.success('Pedido añadido correctamente');
        setIsAddOrderModalVisible(false);
        newOrderForm.resetFields();
      });
  };

  const handleOrderImageChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setOrderImageLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      newOrderForm.setFieldsValue({ image: imageUrl });
      setOrderImageLoading(false);
      message.success('Foto del pedido actualizada!');
    }

    if (info.file.status === 'error') {
      setOrderImageLoading(false);
      message.error('Error al subir la imagen');
    }
  };

  const handleCancelOrder = (id: number) => {
    Modal.confirm({
      title: '¿Cancelar este pedido?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Cancelar Pedido',
      okType: 'danger',
      cancelText: 'Volver',
      onOk() {
        setOrders(orders.filter(order => order.id !== id));
        message.success('Pedido cancelado');
      }
    });
  };

  const uploadButton = (
    <div>
      {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Subir foto</div>
    </div>
  );

  const showNotification = () => {
    notification.open({
      message: 'Nueva Notificación',
      description: 'Tienes una nueva notificación.',
      icon: <BellOutlined style={{ color: colors.warning }} />,
      duration: 5
    });
  };

  return (
    <Layout style={styles.layout}>
      <Header style={{
        backgroundColor: 'transparent',
        padding: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        lineHeight: 'normal',
        margin: '16px 24px 0 0'
      }}>
        <Space>
          <Button
            type="primary"
            icon={<BellOutlined />}
            onClick={showNotification}
            style={{ backgroundColor: darkMode ? colors.darkAccent : colors.primary }}
          >
            Notificaciones
          </Button>
        </Space>
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
          checkedChildren={<BulbFilled style={{ color: colors.warning }} />}
          unCheckedChildren={<BulbOutlined />}
          style={{ backgroundColor: darkMode ? colors.darkAccent : '#f0f0f0' }}
        />
      </Header>

      <Content style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <Card bordered={false} style={styles.card}>
          {/* Header con avatar */}
          <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleAvatarChange}
                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 1000)}
                >
                  <Avatar
                    size={160}
                    src={avatar}
                    icon={avatarLoading ? <LoadingOutlined /> : <UserOutlined />}
                    style={{
                      border: `4px solid ${colors.primary}`,
                      cursor: 'pointer',
                      opacity: avatarLoading ? 0.7 : 1,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                </Upload>

                <Title level={3} style={{ marginTop: 16, ...styles.text }}>{userData.name}</Title>
                <Tag color={colors.primary} icon={<UserOutlined />}>{userData.username}</Tag>

                <div style={{ marginTop: 16 }}>
                  {editMode ? (
                    <Space>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                      >
                        Guardar
                      </Button>
                      <Button onClick={() => setEditMode(false)}>
                        Cancelar
                      </Button>
                    </Space>
                  ) : (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(true)}
                    >
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </Col>

              <Col xs={24} md={18}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="Datos Personales" bordered={false} style={styles.card}>
                      <Descriptions column={1}>
                        <Descriptions.Item label="Nombre" style={styles.text}>{userData.personalInfo.firstName}</Descriptions.Item>
                        <Descriptions.Item label="Apellido" style={styles.text}>{userData.personalInfo.lastName}</Descriptions.Item>
                        <Descriptions.Item label="DNI" style={styles.text}>{userData.personalInfo.dni}</Descriptions.Item>
                        <Descriptions.Item label="Licencia" style={styles.text}>{userData.personalInfo.license}</Descriptions.Item>
                        <Descriptions.Item label="Género">
                          {userData.personalInfo.gender === 'male' ? (
                            <Tag icon={<ManOutlined />} color="blue">Masculino</Tag>
                          ) : (
                            <Tag icon={<WomanOutlined />} color="pink">Femenino</Tag>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Estadísticas" bordered={false} style={styles.card}>
                      <Statistic
                        title="Pedidos realizados"
                        value={userData.stats.orders}
                        prefix={<ShoppingOutlined />}
                        style={styles.text}
                      />
                      <Statistic
                        title="Calificación"
                        value={userData.stats.rating}
                        precision={1}
                        prefix={<StarFilled style={{ color: colors.warning }} />}
                        style={styles.text}
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarStyle={styles.text}
            animated
          >
            <TabPane tab="Información" key="info">
              <div style={{ padding: 24 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="Datos de Contacto" bordered={false} style={styles.card}>
                      <Form form={form} initialValues={{
                        username: userData.username,
                        email: userData.email,
                        phone: userData.phone
                      }}>
                        <Form.Item
                          name="username"
                          label="Usuario"
                          rules={[{ required: true }]}
                        >
                          {editMode ? (
                            <Input
                              prefix={<UserOutlined />}
                              style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
                            />
                          ) : (
                            <Text style={styles.text}>{userData.username}</Text>
                          )}
                        </Form.Item>
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[{ required: true, type: 'email' }]}
                        >
                          {editMode ? (
                            <Input
                              prefix={<MailOutlined />}
                              style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
                            />
                          ) : (
                            <Text style={styles.text}>{userData.email}</Text>
                          )}
                        </Form.Item>
                        <Form.Item
                          name="phone"
                          label="Teléfono"
                          rules={[{ required: true }]}
                        >
                          {editMode ? (
                            <Input
                              prefix={<PhoneOutlined />}
                              style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
                            />
                          ) : (
                            <Text style={styles.text}>{userData.phone}</Text>
                          )}
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>

                  <Col xs={24} md={12}>
                    <Card
                      title="Mis Motos"
                      bordered={false}
                      style={styles.card}
                      extra={
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setIsAddBikeModalVisible(true)}
                        >
                          Añadir Moto
                        </Button>
                      }
                    >
                      {bikes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 24 }}>
                          <Text type="secondary">No tienes motos registradas</Text>
                        </div>
                      ) : (
                        bikes.map(bike => (
                          <Card
                            key={bike.id}
                            style={styles.bikeCard}
                            cover={
                              <div style={styles.imageContainer}>
                                <img
                                  alt={bike.model}
                                  src={bike.image}
                                  style={styles.image}
                                />
                                <Upload
                                  accept="image/*"
                                  showUploadList={false}
                                  beforeUpload={beforeUpload}
                                  onChange={(info) => handleBikeImageChange(info, bike.id)}
                                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 1000)}
                                  style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                    zIndex: 1
                                  }}
                                >
                                  <Button
                                    icon={<CameraOutlined />}
                                    shape="circle"
                                    loading={bikeImageLoading[bike.id]}
                                    style={{ backgroundColor: darkMode ? colors.darkSecondary : '#fff' }}
                                  />
                                </Upload>
                              </div>
                            }
                            actions={[
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteBike(bike.id)}
                              >
                                Eliminar
                              </Button>
                            ]}
                          >
                            <Descriptions column={2}>
                              <Descriptions.Item label="Marca"><Tag color="blue">{bike.brand}</Tag></Descriptions.Item>
                              <Descriptions.Item label="Modelo" style={styles.text}>{bike.model}</Descriptions.Item>
                              <Descriptions.Item label="Año" style={styles.text}>{bike.year}</Descriptions.Item>
                              <Descriptions.Item label="Placa" style={styles.text}>{bike.plate}</Descriptions.Item>
                            </Descriptions>
                          </Card>
                        ))
                      )}
                    </Card>
                  </Col>
                </Row>
              </div>
            </TabPane>
            <TabPane tab="Pedidos" key="orders">
              <div style={{ padding: 24 }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddOrderModalVisible(true)}
                  style={{ marginBottom: 16 }}
                >
                  Añadir Pedido
                </Button>
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
                  dataSource={orders}
                  renderItem={order => (
                    <List.Item>
                      <Card
                        style={styles.bikeCard}
                        cover={
                          order.image && (
                            <div style={styles.imageContainer}>
                              <img
                                alt={`Pedido ${order.id}`}
                                src={order.image}
                                style={styles.image}
                              />
                            </div>
                          )
                        }
                        actions={[
                          <Button
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancelar Pedido
                          </Button>
                        ]}
                      >
                        <Card.Meta
                          title={<Text style={styles.text}>{`Pedido #${order.id}`}</Text>}
                          description={
                            <Text style={styles.textSecondary}>
                              {`Fecha: ${order.date} - Estado: ${order.status}`}
                            </Text>
                          }
                        />
                        <div style={{ marginTop: 16 }}>
                          <Text strong style={styles.text}>Artículos:</Text>
                          <ul style={{ color: styles.text.color }}>
                            {order.items.map(item => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>
            <TabPane tab="Seguridad" key="security">
              <div style={{ padding: 24 }}>
                <Button
                  type="primary"
                  icon={<LockOutlined />}
                  onClick={() => setIsChangePasswordModalVisible(true)}
                  style={{ marginBottom: 16 }}
                >
                  Cambiar Contraseña
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* Modal para añadir moto */}
        <Modal
          title="Añadir Nueva Moto"
          visible={isAddBikeModalVisible}
          onOk={handleAddBike}
          onCancel={() => setIsAddBikeModalVisible(false)}
          okText="Guardar"
          cancelText="Cancelar"
          width={700}
          bodyStyle={{ backgroundColor: darkMode ? colors.darkSecondary : '#fff' }}
        >
          <Form form={newBikeForm} layout="vertical">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="brand"
                  label="Marca"
                  rules={[{ required: true, message: 'Ingrese la marca de la moto' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Ej. Yamaha, Honda, etc."
                    style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="model"
                  label="Modelo"
                  rules={[{ required: true, message: 'Ingrese el modelo de la moto' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Ej. YZF-R6, CBR600RR, etc."
                    style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="year"
                  label="Año"
                  rules={[{ required: true, message: 'Ingrese el año de la moto' }]}
                >
                  <InputNumber
                    style={{ width: '100%', backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
                    min={1990}
                    max={new Date().getFullYear() + 1}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="plate"
                  label="Placa"
                  rules={[{ required: true, message: 'Ingrese la placa de la moto' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Ej. ABC-1234"
                    style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="imageFile"
              label="Foto de la Moto"
              valuePropName="file"
              getValueFromEvent={(e) => e.fileList[0]?.originFileObj}
              rules={[{ required: true, message: 'Suba una foto de la moto' }]}
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 1000)}
              >
                {newBikeForm.getFieldValue('imageFile') ? (
                  <img
                    src={URL.createObjectURL(newBikeForm.getFieldValue('imageFile'))}
                    alt="preview"
                    style={styles.image}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal para cambiar contraseña */}
        <Modal
          title="Cambiar Contraseña"
          visible={isChangePasswordModalVisible}
          onOk={handleChangePassword}
          onCancel={() => setIsChangePasswordModalVisible(false)}
          okText="Guardar"
          cancelText="Cancelar"
          width={500}
          bodyStyle={{ backgroundColor: darkMode ? colors.darkSecondary : '#fff' }}
        >
          <Form form={passwordForm} layout="vertical">
            <Form.Item
              name="currentPassword"
              label="Contraseña Actual"
              rules={[{ required: true, message: 'Ingrese su contraseña actual' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Nueva Contraseña"
              rules={[{ required: true, message: 'Ingrese su nueva contraseña' }]}
            >
              <Input.Password
                prefix={<KeyOutlined />}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirmar Contraseña"
              rules={[{ required: true, message: 'Confirme su nueva contraseña' }]}
            >
              <Input.Password
                prefix={<KeyOutlined />}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal para añadir pedido */}
        <Modal
          title="Añadir Nuevo Pedido"
          visible={isAddOrderModalVisible}
          onOk={handleAddOrder}
          onCancel={() => setIsAddOrderModalVisible(false)}
          okText="Guardar"
          cancelText="Cancelar"
          width={700}
          bodyStyle={{ backgroundColor: darkMode ? colors.darkSecondary : '#fff' }}
        >
          <Form form={newOrderForm} layout="vertical">
            <Form.Item
              name="date"
              label="Fecha"
              rules={[{ required: true, message: 'Seleccione la fecha del pedido' }]}
            >
              <DatePicker style={{ width: '100%', backgroundColor: darkMode ? colors.darkAccent : '#fff' }} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Estado"
              rules={[{ required: true, message: 'Ingrese el estado del pedido' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Ej. Completado, En Proceso, etc."
                style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
              />
            </Form.Item>
            <Form.Item
              name="items"
              label="Artículos"
              rules={[{ required: true, message: 'Ingrese los artículos del pedido' }]}
            >
              <Input.TextArea
                prefix={<UserOutlined />}
                placeholder="Ej. Repuesto 1, Repuesto 2, etc."
                style={{ backgroundColor: darkMode ? colors.darkAccent : '#fff' }}
              />
            </Form.Item>
            <Form.Item
              name="imageFile"
              label="Foto del Pedido"
              valuePropName="file"
              getValueFromEvent={(e) => e.fileList[0]?.originFileObj}
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleOrderImageChange}
                customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 1000)}
              >
                {newOrderForm.getFieldValue('imageFile') ? (
                  <img
                    src={URL.createObjectURL(newOrderForm.getFieldValue('imageFile'))}
                    alt="preview"
                    style={styles.image}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default MotoUserProfile;
