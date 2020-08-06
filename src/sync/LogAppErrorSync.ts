import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import LogAppErrorModel from '../types/log_app_error/LogAppErrorModel'
import LogAppErrorListModel from '../types/log_app_error/LogAppErrorListModel'
import BaseSync from './BaseSync'

class LogAppErrorSync implements BaseSync {
  send = async () => {
    if (LogAppErrorService.shouldSync()) {
      const logs = await LogAppErrorService.getSavedLogs()

      const items: LogAppErrorModel[] = logs.map(
        (log) =>
          ({
            title: log.title,
            error: log.error,
            file: log.file,
            date: log.date,
          } as LogAppErrorModel)
      )

      const model = {
        items: items,
      } as LogAppErrorListModel

      LogAppErrorService.saveAll(model)
    }
  }
}

export default new LogAppErrorSync()
