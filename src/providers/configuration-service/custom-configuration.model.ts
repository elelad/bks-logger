import { Logger } from 'ionic-logging-service';
//import * as moment from 'moment';

//import { EntityTypes } from '../permissions-service/models/permissionSet.model';
//import { SideMenuOption } from '../../components/side-menu-content/models/side-menu-option';
//import { MenuType } from 'ionic-angular/components/app/menu-interface';
//import { PowerSearchMenuItems } from '../../components/power-search/models/power-search.model';
//import { UserInfoModel } from '../users-service/userInfo.model';

export interface SystemSettings {
	baseAPI: string;
	baseDomain: string;
	iisVirtualDirectoryName: string;
	idleTimeout: number;
	idleTimeoutPeriod: number;
	pingInterval: number;
	theme: string;
	lang: string;
	langDirection: string;
	daysInChunk: number;
	displayDateTimeFormat: string;
	searchDateFormat: string;
	dateFormatServerParam: string;
	dateTimeFormatServerParam: string;
	serverDateTimeFormat: string;
	displayDateFormat: string;
	downloadBackwardOfflineDays: number;
	downloadForwardOfflineDays: number;
	displayTimeFormat: string;
	fileSizeLimit: number;
	upcomingDays: number;
	//offlineMomentStartDate: moment.Moment;
	//offlineMomentEndDate: moment.Moment;
	offlineFormatStartDate: string;
	offlineFormatEndDate: string;
	currentFormatDate: string;
	currentFormatDateTime: string;
	momentDateTimeFormat: string;
	documentDirection: string;
	platformType: PlatformType;
	//menuType: MenuType,
	realPlatformType: PlatformType;
	supportCordova: boolean;
	connectionStatus: ConnectionStatus;
	helpURL: string;
	navigationItem: NavigationItem;
	//powerSearchMenuItems: PowerSearchMenuItems[];
	modalMaxWidth: number;
	splitPaneMaxWidth: number;
	mainHelpUrl: string;
	//userInfoModel: UserInfoModel;
	ssoWithoutHeaderbase: boolean;
	ssoUserName: string;
	displayUserProfileImage: boolean;
	authenticationMode: AuthenticationMode;
	ssoType: SSOType;
	loginType: LoginType;
	syncTimeOutInSeconds:number;
	syncDeltaTimeOutInSeconds:number;
	syncRetry:number;
	
}

export interface ModalDialogs {
	confirmSynchronization: string;
	synchronizationProcess: string;
	bksModalPopupComponent: string;
}

export interface StorageKeys {
	systemConfiguration: string;
	hasSeenFirstSettings: string;
	token: string;
	currentView: string;
	userDetails: string;
	userDailyEvents: string;
	userLearningEvents: string;
	userCourses: string;
	userAchievements: string;
	eventsExtraDetails: string
	storedFiles: string;
	currentCourse: string;
	portalMenu: string;
	courseMenu: string;
	userPermissionSets: string;
	courseSummary: string;
	courseParticipants: string;
	participantEvaluationEvents: string;
	permissionSets: string;
	courseSummaryModel: string;
	usersSearchResult: string;
	navigationItem: string;
	currentActiveMenu: string;
	ssoRegularLogin: string;
	examFlagedQuestions: string;
	changePasswordPolicy:string;
	assessmentFormsData:string;
	assessmentFormsResponses:string;
}

export interface Pages {
	login: string;
	portal: string;
}

export interface Component {
	login: string;
}

export interface ConfigEvents {
	authenticated: string;
	buildSideMenu: string;
	buildMenuHeader: string;
	filterStatus: string;
	toggleSearchPane: string;
	showElasticResults: string;
	logout: string;
	windowResized: string;
	navigateToEntity: string;
	configurationLoaded: string;
	buildBreadcrumbs: string;
	updatePortalLayout: string;
	buildCourseSummary: string;
	checkUrlParams: string;
	authenticatedAndReady: string;
	genericFilter: string;
	generalFilterOpen: string;
	generalFilterClose: string;
	breadCrumbsClick: string;
	searchClick: string;
	setRemoveFavoritesForUser: string;
	extraDetailsLoaed: string;
	closeSearch: string;
	turnOffExamTimer: string;
	buildCourseSummaryCompleted: string;
	clickSideMenuItem:string;
	toggleEvaluationMenu:string;
}

export interface ConfigExamEvents {
	closeExam: string;
	toggleMainAppMenu: string;
	openPage: string;
	examStart: string;
	previousQuestion: string;
	updateSyncBtn: string;
	submitExam: string;
	buildCourseSummary: string;
}

export interface API {
	login: string;
	logout: string;
	refreshToken: string;
	getCourses: string;
	getManagedCourses: string;
	getLearningEvents: string;
	getSchedule: string;
	getCourseKnowledgeBase: string;
	uploadData: string;
	getUserAchievements: string;
	getEventsExtraDetails: string;
	getEventExtraDetails: string;
	getEventsForEvaluation: string;
	getParticipants: string;
	getParticipantsByCourseId: string;
	getCourseSummary: string;
	getPermissionSets: string;
	getUserDetailsView: string;
	getSystemConfiguration: string;
	getExamExecution: string;
	getExamBlockingContent: string;
	getUserPortalItems: string;
	getMainNavigationEntity: string;
	setRemoveFavoritesForUser: string;
	getSideMenuHeader: string;
	getFavoritesForUser: string;
	updateFavoriteOrder: string;
	getAutoCompleteSearchResults: string;
	getAutoCompleteSearchResultsEntity: string;
	getExamExecutionOnFromServer: string
	updateExamMinutesRemaining: string;
	submitExam: string;
	saveQuestionAnswer: string;
	initializeOnlineExamExecution: string;
	setEventSelfEvaluation: string;
	setEventExtraDetails: string;
	foxLogin: string;
	getPasswordPolicy: string;
	setNewPassword: string;
	confirmCurrentPassword: string;
	validatePasswordNotLoginName: string;
	getSwapTrainees: string;
	getSwapTraineeDetails: string;
	swapTrainees: string;
	getAssessmentFormsData: string;
	getAssessmentFormsResponsesByDateRange:string;

}

export interface FileAppender{
	batchSize: number;
	threshold: string;
}

export interface LoggerState {
	logger?: Logger;
	logLevels: LogLevels[];
	localStorageAppender: LocalStorageAppenderInterface;
	ajaxAppender: AjaxAppender;
	browserConsoleAppender: BrowserConsoleAppenderInterface;
	fileAppender: FileAppender
}

export interface AjaxAppender {
	url: string;
	timerInterval: number;
	batchSize: number;
	threshold: string;
}

export interface BrowserConsoleAppenderInterface {
	name: string;
	threshold: string;
}

export interface LocalStorageAppenderInterface {
	localStorageKey: string;
	maxMessages: number;
	threshold: string;
}

export interface LogLevels {
	loggerName: string;
	logLevel: string;
}

export interface UserAppState {
	token: string;
	currentView: string;
	hasSeenFirstSettings: boolean;
}


export enum ConnectionStatus {
	Connected = 0,
	Disconnected = -1
}

export enum PlatformType {
	Mobile = 0,
	Browser = -1
}

export class NavigationItem {
	entityId: number = 0;
	//entityType: EntityTypes = EntityTypes.System;
	entityName: string = "HOME";
	screenId?: number;
	//sideMenuOption?: SideMenuOption;
	modalItemModel?:ModalItemModel;
}

export class ModalItemModel {
	modalItemName: string;
	modalItemParams: any;

  }

export interface CustomerImages {
	customerLoginLogo: string;
	customerLoginBackgroundLogo: string;
	customerLoginBackground: string;
	customerHeaderLogo: string;
	customerBottomLogo: string;
}

export enum ModalSize {
	Small = "small",
	Medium = "medium",
	Large = "large"
}

export enum AuthenticationMode {
	form = 0,
	sso = 1,
	both = 2
}


export enum SSOType {
	none = 0,
	windowsAuthentication = 1,
	headerBasedSSO = 2,
	custom = 3,
	saml = 4
}



export enum LoginType {
	regularLogin = 0,
	SSOInvalid = 1,
	SSoLogin = 2
}


export const CONST = {
  HAS_SEEN_FIRST_SETTINGS: "hasSeenFirstSettings",
  ASSESSMENT_FORM_RESPONSES: "assessmentFormsResponses",
  NA_FIELD: -99,
  MIN_RELATIONSHIP_ID: 200

}
