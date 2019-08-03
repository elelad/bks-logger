import { Injectable } from "@angular/core";
import { File, DirectoryEntry } from '@ionic-native/file';
import { Platform, AlertController, ToastController } from "ionic-angular";
import { SocialSharing } from '@ionic-native/social-sharing';





@Injectable()
export class BksFileAppenderService {

    constructor(private platform: Platform, private file: File,
        private socialSharing: SocialSharing,
        private alert: AlertController,
        private toast: ToastController) {
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

        this.removeOldFiles(2);

        try {

            const bksLogDirPath = this.getTargetLogDirPath();
            console.log(bksLogDirPath);
            const isDirectoryExists = await this.file.checkDir(bksLogDirPath, "log").catch(e => console.log(e));
            console.log('isDirectoryExists', isDirectoryExists);
            if (!isDirectoryExists) {
                const directoryEntry: DirectoryEntry = await this.file.createDir(bksLogDirPath, "log", false);
                if (directoryEntry) {
                    //console.log('directoryEntry', directoryEntry);
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

    getTodyayFileName() {
        const now = new Date();
        return now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear() + '.json';
    }

    async writeToLogFile(logs) {

        const methodName = "writeToLogFile";
        console.log(methodName)

        if (!logs) return;

        console.log(logs);
        try {
            const dir = this.getTargetLogDirPath() + 'log/';
            const fileName = this.getTodyayFileName();
            //console.log( JSON.stringify(logs));
            const fileExist = await this.file.checkFile(dir, fileName).catch(e => console.log(e));
            console.log('fileExist', fileExist);
            if (fileExist) {
                this.file.readAsText(dir, fileName).then((txt) => {
                    const logAsString = JSON.stringify(logs);
                    const oldLogs = txt.slice(0, -1) + ','; // remove last ] in json
                    const newLogs = logAsString.substr(1);
                    return Promise.resolve(oldLogs + newLogs);
                }).then((formatedLogs) => {
                    this.file.writeFile(dir, fileName, formatedLogs, { replace: true }).then((fa) => {
                        console.log('file updated');
                    });
                }).catch(e => console.log(e));
            } else {
                this.file.writeFile(dir, fileName, JSON.stringify(logs));
            }
        } catch (e) {
            console.log(e);
        }
    }

    removeOldFiles(maxFilesToSave) {
        const dir = this.getTargetLogDirPath();
        this.file.listDir(dir, 'log').then(files => {
            console.log(files);
            if (!files) return;
            if (files.length <= maxFilesToSave) return;
            files.sort((fe, se) => {
                let feName = fe.name.replace('.json', '');
                let feSplitName = feName.split('-');
                //console.log('feSplitName', feSplitName);
                const feNum = new Date(+feSplitName[2], (+feSplitName[1] - 1), +feSplitName[0]).getTime();
                let seName = se.name.replace('.json', '');
                let seSplitName = seName.split('-');
                //console.log('seSplitName', seSplitName);
                let seNum = new Date(+seSplitName[2], (+seSplitName[1] - 1), +seSplitName[0]).getTime();
                return seNum - feNum;
            })
            console.log(files);
            const dir = this.getTargetLogDirPath() + 'log/';
            for (let i = maxFilesToSave; i < files.length; i++) {
                this.file.removeFile(dir, files[i].name).then(() => {
                    console.log('delete done');
                }).catch(e => console.log(e));
            }
        }).catch(e => console.log(e));
    }

    async chooseFileToSend() {
        console.log('chooseFileToSend');
        
        const dir = this.getTargetLogDirPath();
        const filesList = await this.file.listDir(dir, 'log').catch(e => console.log(e));
        //const filesList =[{name: '1-2-3', nativeURL: 'bla a'}, {name: '4-5-6', nativeURL: 'bla b'}, {name: '7-8-9', nativeURL: 'bla c'}];
        if (!filesList) return this.toast.create({ message: 'No Log File Found' }).present();
        if (filesList.length === 1) return this.share(filesList[0].nativeURL);
        const filesAlert = this.alert.create({ title: 'Choose Files to send' });
        filesList.forEach(f => {
            filesAlert.addInput({
                type: 'checkbox',
                label: f.name,
                value: f.nativeURL
            })
        });
        filesAlert.addButton('Cancel');
        filesAlert.addButton({
            text: 'OK',
            handler: (data)=>{
                console.log(data);
                if (data.length != 0) this.share(data);
            }
        });
        filesAlert.present();
    }

    async share(files: string | string[]) {
        console.log('share');
        this.socialSharing.share('', 'Log files form Fox', files).catch(e => console.log(e));
        
    }

}