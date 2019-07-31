import { Injectable } from "@angular/core";
import { File, DirectoryEntry } from '@ionic-native/file';
import { Platform } from "ionic-angular";





@Injectable()
export class BksFileAppenderService {

    constructor(private platform: Platform, private file: File) {
        //console.log(this.getTodyayFileName());
        
    }

    getTargetLogDirPath() {
        console.log('getTargetLogDirPath');
        //console.log(this.file);
        if (this.platform.is('ios')) return this.file.dataDirectory;
        //return this.file.dataDirectory;
        return this.file.externalDataDirectory;
    }


    async createBksLogFolder(): Promise<boolean> {
        const methodName = "createBksLogFolder";

        console.log(methodName);

        try {

            const bksLogDirPath = this.getTargetLogDirPath();
            console.log(bksLogDirPath);
            const isDirectoryExists = await this.file.checkDir(bksLogDirPath, "log").catch(e=>console.log(e));
            console.log('isDirectoryExists', isDirectoryExists);
            if (!isDirectoryExists) {
                console.log('cca');
                const directoryEntry: DirectoryEntry = await this.file.createDir(bksLogDirPath, "log", false);
                if (directoryEntry) {
                    console.log('directoryEntry', directoryEntry);
                    //this.bksConfigurationService.loggerState.logger.debug(methodName, [``]);
                }
                else {
                    //this.bksConfigurationService.loggerState.logger.debug(methodName, [`Failed create directory ${bksDirPath}`]);
                    return false;
                }
            }
            else {
                //this.bksConfigurationService.loggerState.logger.debug(methodName, [`Directory ${bksDirPath} exists`]);
            }

            return true;
        }
        catch (error) {
            //this.bksConfigurationService.loggerState.logger.error(methodName, [error]);
            console.log(error);
            return false;
        }
        finally {

        }
    }

    getTodyayFileName(){
        const now = new Date();
        console.log(now);
        return 'bksLog' + now.getDate() + now.getFullYear() + '.json';
    }

    async writeToLogFile(logs) {
        
        const methodName = "writeToLogFile";
        console.log(methodName)

        if (!logs) return;

        console.log(logs);
        //try {
            const dir = this.getTargetLogDirPath() + 'log/';
            const fileName = this.getTodyayFileName();
            //console.log( JSON.stringify(logs));
            const fileExist = await this.file.checkFile(dir, fileName).catch(e=>console.log(e));
            console.log('fileExist', fileExist);
            if (fileExist){
                this.file.writeFile(dir, fileName,  JSON.stringify(logs), {append: true});
            }else{
                this.file.writeFile(dir, fileName,  JSON.stringify(logs));
            }
        /* }catch (e){
            console.log(e);
        } */
    }

}