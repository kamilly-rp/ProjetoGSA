import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
   'https://gsaimobiliaria.com.br', //
  'https://www.gsaimobiliaria.com.br',  // cors backend aceita frontend do versel
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rota de "ping" para manter o servidor acordado
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' MongoDB conectado com sucesso');
  // Inicia o servidor só depois de conectar ao banco
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
})
.catch((err) => {
  console.error(' Erro ao conectar ao MongoDB:', err);
});

// Rotas
app.use('/api/user', userRoute);
app.use('/api/residency', residencyRoute);
