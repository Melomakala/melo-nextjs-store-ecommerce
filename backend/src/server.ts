import logger from "./common/utils/logger"
import app from "./index"

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    logger.info(`running on http://localhost:${PORT}`)
})