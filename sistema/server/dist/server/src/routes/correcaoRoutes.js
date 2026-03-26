"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const correcaoService_1 = require("../services/correcaoService");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * POST /api/corrigir
 * Accepts two files via multipart/form-data:
 * - gabarito: CSV file with proof answers key
 * - respostas: CSV file with student answers
 * - modo: query parameter or body field (default: "rigoroso")
 *
 * Returns:
 * - JSON: Correction results array + CSV string
 * - Can download CSV via "download" query parameter
 */
router.post('/corrigir', upload.fields([{ name: 'gabarito' }, { name: 'respostas' }]), (req, res) => {
    try {
        // Validate files
        if (!req.files || !('gabarito' in req.files) || !('respostas' in req.files)) {
            return res.status(400).json({
                success: false,
                error: 'Dois arquivos são necessários: gabarito e respostas'
            });
        }
        const gabaritoFile = Array.isArray(req.files.gabarito) ? req.files.gabarito[0] : req.files.gabarito;
        const respostasFile = Array.isArray(req.files.respostas) ? req.files.respostas[0] : req.files.respostas;
        if (!gabaritoFile || !respostasFile) {
            return res.status(400).json({
                success: false,
                error: 'Arquivos inválidos'
            });
        }
        // Get correction mode from query or body (default: rigoroso)
        const modo = req.query.modo || req.body.modo || 'rigoroso';
        if (modo !== 'rigoroso' && modo !== 'proporcional') {
            return res.status(400).json({
                success: false,
                error: 'Modo deve ser "rigoroso" ou "proporcional"'
            });
        }
        // Correct proofs
        const { resultados, csv } = (0, correcaoService_1.corrigirProvas)(gabaritoFile.buffer, respostasFile.buffer, modo);
        // Check if client wants CSV download
        const download = req.query.download === 'true';
        if (download) {
            // Return CSV file for download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="resultados_correcao.csv"');
            res.send(csv);
        }
        else {
            // Return JSON response
            res.json({
                success: true,
                message: `${resultados.length} prova(s) corrigida(s) com sucesso`,
                modo,
                resultados,
                csv
            });
        }
    }
    catch (error) {
        console.error('Erro ao corrigir provas:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido ao corrigir provas'
        });
    }
});
exports.default = router;
